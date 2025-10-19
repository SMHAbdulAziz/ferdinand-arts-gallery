export default function handler(req, res) {
  console.log('Health check called at:', new Date().toISOString());
  console.log('NODE_ENV:', process.env.NODE_ENV);
  console.log('PORT:', process.env.PORT);
  
  res.status(200).json({ 
    status: 'ok',
    timestamp: new Date().toISOString(),
    port: process.env.PORT || '3000',
    env: process.env.NODE_ENV || 'development'
  });
}