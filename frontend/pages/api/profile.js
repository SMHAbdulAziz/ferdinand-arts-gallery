import { query } from '../../utils/db';
import { parsePhoneNumber } from 'libphonenumber-js';
import jwt from 'jsonwebtoken';
import { getCountryCodeFromCallingCode } from '../../utils/countryCodeMap';

export default async function handler(req, res) {
  if (req.method !== 'PUT') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Verify authentication
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    const userId = decoded.id;

    const { firstName, lastName, phone, countryCode, address } = req.body;

    // Validate phone if provided
    if (phone) {
      try {
        const isoCountryCode = getCountryCodeFromCallingCode(countryCode);
        const parsed = parsePhoneNumber(phone, isoCountryCode);
        if (!parsed || !parsed.isValid()) {
          return res.status(400).json({ 
            error: 'Invalid phone number for the selected country'
          });
        }
      } catch (err) {
        return res.status(400).json({ 
          error: 'Invalid phone number format'
        });
      }
    }

    // Update user profile
    const result = await query(
      `UPDATE users 
       SET first_name = $1, 
           last_name = $2, 
           phone = $3, 
           country_code = $4,
           address = $5,
           updated_at = CURRENT_TIMESTAMP
       WHERE id = $6
       RETURNING id, email, first_name, last_name, phone, country_code, address, role`,
      [
        firstName || null,
        lastName || null,
        phone || null,
        countryCode || null,
        address ? JSON.stringify(address) : null,
        userId
      ]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    const user = result.rows[0];

    let parsedAddress = null;
    try {
      parsedAddress = user.address ? JSON.parse(user.address) : null;
    } catch (parseErr) {
      console.warn('Failed to parse address JSON:', parseErr);
      parsedAddress = null;
    }

    return res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      user: {
        id: user.id,
        email: user.email,
        firstName: user.first_name,
        lastName: user.last_name,
        phone: user.phone,
        countryCode: user.country_code,
        address: parsedAddress,
        role: user.role
      }
    });
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ error: 'Invalid token' });
    }
    console.error('Profile update error:', error);
    return res.status(500).json({ error: 'Failed to update profile' });
  }
}
