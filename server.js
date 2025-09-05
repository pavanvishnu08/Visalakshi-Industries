const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');
const querystring = require('querystring');

// OpenAI integration
const OpenAI = require('openai');

// the newest OpenAI model is "gpt-5" which was released August 7, 2025. do not change this unless explicitly requested by the user
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});

// Company knowledge base from brochure
const companyKnowledge = `
Visalakshi Industries Started In 2021.

Technology Promoters:
Visalakshi Industries is supported by a group of expert committee for continuous research for everlasting growth in terms of technology, quality, safety & cost oriented.

What We Can Deliver:
Visalakshi Industries with its highly experienced personnel manufacture & supply sophisticated equipment's to suit utmost safety produce constant quality product to work with zero break downs with optimized man-power & energy items for all the cement, iron ore/sponge iron projects, mining industries, coal industries, steel bridges, PEB buildings, chemical, pharmaceutical food processing industries, ports (ship yards), airports and all steel structures etc. We are also pioneered in sand blasting, copper slag blasting, airless painting and metalizing.

Infrastructure:
- Manufacturing Unit: 1 Acre
- Open Area: 12000 SFT
- Plant Covered Area: 24717 SFT
- Auxiliary Covered Area Shed 1: 11556 SFT
- Auxiliary Covered Area Shed 2: 11085 SFT
- Office & Stores Area: 2326 SFT

Equipment:
- 20 TON EOT Crane: 1 Nos
- 7.5 TON EOT Crane: 1 Nos
- 3 TON EOT Crane: 1 Nos
- 14 TON HYDRA: 1 Nos
- 12 TON HYDRA: 1 Nos
- Chain Blocks 1, 2, 3&5tons: 6 Nos
- 125 KVA Generator: 1 Nos
- 60 HP Compressor: 1 Nos
- SAW Welding Machines: 2 Nos
- MIG Welding Machines: 10 Nos
- ARC Welding Machines: 15 Nos
- TIG Welding Machines: 2 Nos
- Angle Grinder 7", 5" & 4": 25 Nos
- Mother Oven: 1 Nos
- Portable Oven: 6 Nos
- PUG Machines: 6 Nos
- Broch Cutting Machine 32& 50mm: 3 Nos
- Chopsaw Cutter Machine: 4 Nos
- Sand Blasting Compressor: 3 Nos
- Sand Blasting Hoppers: 6 Nos
- Airless Painting Pumps: 5 Nos
- Metallizing Equipment: 1 Set

Products & Services:
- All kind of structural Buildings
- Steel Bridges
- PEB Buildings
- Railway Bridges
- Railway Platform Sheds
- Sand and Copper Slag Blasting
- Airless Painting
- Metallizing

Testing Facilities:
- Dye-penetration Test
- Radiographic Test (Through Outside Agency)
- Magnetic Particle Test
- Ultrasonic Test
- Hardness Test
- Hot & Cold Tensile Strength
- Bending Test
- Corrosion Test

Quality Policy:
Visalakshi Industries is dedicated to quality of product, timely delivery, prompt response to customer needs, promoting good relations with vendors, and providing good environment for employees.

Safety Policy:
The company follows strict safety protocols including mandatory safety shoes and helmets, eye protection for specialized work, strategically placed fire extinguishers, regular electrical inspections, and safety audits every 4 months.

Contact Information:
- Phone: +91-8121035599, +91-9849539366
- Email: info@visalakshiindustries.com
- WhatsApp Support: +91-8121035599
`;

const MIME_TYPES = {
    '.html': 'text/html',
    '.css': 'text/css',
    '.js': 'text/javascript',
    '.json': 'application/json',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.gif': 'image/gif',
    '.svg': 'image/svg+xml',
    '.ico': 'image/x-icon',
    '.docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
};

function getMimeType(filePath) {
    const ext = path.extname(filePath).toLowerCase();
    return MIME_TYPES[ext] || 'text/plain';
}

async function handleChatRequest(req, res) {
    try {
        let body = '';
        req.on('data', chunk => {
            body += chunk.toString();
        });

        req.on('end', async () => {
            try {
                const { message } = JSON.parse(body);
                
                const response = await openai.chat.completions.create({
                    model: "gpt-5", // the newest OpenAI model is "gpt-5" which was released August 7, 2025. do not change this unless explicitly requested by the user
                    messages: [
                        {
                            role: "system",
                            content: `You are a helpful customer service assistant for Visalakshi Industries India Pvt Ltd, a fabrication company founded in 2021. Use the following company information to answer customer questions accurately and professionally:

${companyKnowledge}

Important guidelines:
1. Only answer questions based on the provided company information
2. If asked about something not covered in the company information, politely redirect them to contact via WhatsApp at +91-8121035599
3. Be helpful, professional, and concise
4. Focus on the company's capabilities, services, and expertise
5. If asked about pricing, lead times, or specific project details, direct them to contact directly for a personalized quote

Example responses:
- For questions about services: Provide detailed information from the knowledge base
- For questions about capabilities: Reference specific equipment and infrastructure
- For questions about contact: Provide the contact information
- For questions outside the scope: "For detailed information about [topic], please contact our team directly via WhatsApp at +91-8121035599 for personalized assistance."
`
                        },
                        {
                            role: "user",
                            content: message
                        }
                    ],
                    max_tokens: 500,
                    temperature: 0.7
                });

                const reply = response.choices[0].message.content;
                
                res.writeHead(200, {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Methods': 'POST, OPTIONS',
                    'Access-Control-Allow-Headers': 'Content-Type'
                });
                
                res.end(JSON.stringify({ reply }));
                
            } catch (error) {
                console.error('Chat processing error:', error);
                res.writeHead(500, {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                });
                res.end(JSON.stringify({ 
                    error: 'Sorry, I encountered an error. Please contact us via WhatsApp at +91-8121035599' 
                }));
            }
        });
    } catch (error) {
        console.error('Chat request error:', error);
        res.writeHead(500, {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
        });
        res.end(JSON.stringify({ 
            error: 'Sorry, I encountered an error. Please contact us via WhatsApp at +91-8121035599' 
        }));
    }
}

const server = http.createServer((req, res) => {
    const parsedUrl = url.parse(req.url, true);
    const pathname = parsedUrl.pathname;
    
    // Handle CORS preflight requests
    if (req.method === 'OPTIONS') {
        res.writeHead(200, {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type'
        });
        res.end();
        return;
    }
    
    // Chat API endpoint
    if (pathname === '/api/chat' && req.method === 'POST') {
        handleChatRequest(req, res);
        return;
    }
    
    // Serve static files
    let filePath = pathname === '/' ? './index.html' : `.${pathname}`;
    
    // Security: prevent directory traversal
    if (filePath.includes('..')) {
        res.writeHead(400);
        res.end('Bad Request');
        return;
    }
    
    fs.readFile(filePath, (err, content) => {
        if (err) {
            if (err.code === 'ENOENT') {
                res.writeHead(404);
                res.end('File not found');
            } else {
                res.writeHead(500);
                res.end('Server error');
            }
        } else {
            const mimeType = getMimeType(filePath);
            res.writeHead(200, { 'Content-Type': mimeType });
            res.end(content);
        }
    });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on port ${PORT}`);
});