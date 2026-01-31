export default function handler(req, res) {
  res.status(200).json({ 
    status: 'ok', 
    message: 'Vibecraft API is running',
    project: 'opqstjxvkzdxkpzadihv',
    timestamp: new Date().toISOString() 
  });
}
