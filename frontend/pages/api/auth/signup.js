import { hashPassword, isValidEmail, validatePassword } from '../../../utils/auth';
import { query } from '../../../utils/db';
import { parsePhoneNumber } from 'libphonenumber-js';
import { getCountryCodeFromCallingCode } from '../../../utils/countryCodeMap';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { email, password, firstName, lastName, phone, countryCode, hcaptchaToken } = req.body;

  try {
    // Validate hCAPTCHA token
    if (!hcaptchaToken) {
      return res.status(400).json({ error: 'hCAPTCHA verification required' });
    }

    // Verify hCAPTCHA with hCaptcha service
    try {
      console.log('🔐 Verifying hCAPTCHA token:', hcaptchaToken.substring(0, 20) + '...');
      console.log('🔑 Using secret key starting with:', process.env.HCAPTCHA_SECRET_KEY?.substring(0, 10) + '...');
      
      const hcaptchaResponse = await fetch('https://hcaptcha.com/siteverify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: `secret=${process.env.HCAPTCHA_SECRET_KEY}&response=${hcaptchaToken}`
      });

      const hcaptchaData = await hcaptchaResponse.json();
      console.log('📋 hCAPTCHA Response:', JSON.stringify(hcaptchaData, null, 2));
      
      if (!hcaptchaData.success) {
        console.error('❌ hCAPTCHA verification failed:', hcaptchaData);
        console.error('Error codes:', hcaptchaData['error-codes']);
        return res.status(400).json({ 
          error: 'Human verification failed. Please try again.',
          details: hcaptchaData['error-codes']
        });
      }
      console.log('✅ hCAPTCHA verification succeeded');
    } catch (hcaptchaErr) {
      console.error('❌ hCAPTCHA error:', hcaptchaErr);
      return res.status(400).json({ error: 'Human verification failed. Please try again.' });
    }

    // Validate input
    if (!email || !password || !firstName || !lastName || !phone) {
      return res.status(400).json({ error: 'Email, password, first name, last name, and phone are required' });
    }

    if (!isValidEmail(email)) {
      return res.status(400).json({ error: 'Invalid email format' });
    }

    // Validate phone number using libphonenumber-js
    // Extract country code from the countryCode field (e.g., "+1" -> "US")
    let parsedPhone;
    try {
      const isoCountryCode = getCountryCodeFromCallingCode(countryCode);
      parsedPhone = parsePhoneNumber(phone, isoCountryCode);
      if (!parsedPhone || !parsedPhone.isValid()) {
        return res.status(400).json({ 
          error: 'Invalid phone number for the selected country. Please check the format.' 
        });
      }
    } catch (err) {
      return res.status(400).json({ 
        error: 'Invalid phone number format. Please enter a valid number.' 
      });
    }

    const passwordValidation = validatePassword(password);
    if (!passwordValidation.valid) {
      return res.status(400).json({ error: passwordValidation.error });
    }

    // Check if user exists
    const existingUser = await query(
      'SELECT id FROM users WHERE email = $1',
      [email.toLowerCase()]
    );

    if (existingUser.rows.length > 0) {
      return res.status(409).json({ error: 'Email already registered' });
    }

    // Hash password
    const passwordHash = hashPassword(password);

    // Store the formatted international phone number
    const internationalPhone = parsedPhone.formatInternational();

    // Create user
    const result = await query(
      `INSERT INTO users (email, password_hash, first_name, last_name, phone, country_code)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING id, email, first_name, last_name, phone, country_code, created_at`,
      [email.toLowerCase(), passwordHash, firstName, lastName, internationalPhone, countryCode]
    );

    const user = result.rows[0];

    return res.status(201).json({
      success: true,
      message: 'User registered successfully',
      user: {
        id: user.id,
        email: user.email,
        firstName: user.first_name,
        lastName: user.last_name,
        phone: user.phone,
        countryCode: user.country_code
      }
    });
  } catch (error) {
    console.error('Signup error:', error);
    return res.status(500).json({ error: 'Failed to register user' });
  }
}
