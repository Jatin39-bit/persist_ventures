const router= require('express').Router();
const { body } = require('express-validator');
const { validationResult } = require('express-validator');
// const OpenAI = require('openai');


// const openai = new OpenAI({
//   apiKey: process.env.OPENAI_API_KEY, 
// });

// async function generateMemeCaptions(imageUrl) {
//   try {
//     const response = await openai.chat.completions.create({
//       model: "gpt-4o", 
//       messages: [
//         {
//           role: "system",
//           content:
//             "You are a creative and humorous assistant that generates funny meme captions for images.",
//         },
//         {
//           role: "user",
//           content: [
//             {
//               type: "text",
//               text: "Generate 5 funny meme captions for this image.",
//             },
//             { type: "image_url", image_url: { url: imageUrl } },
//           ],
//         },
//       ],
//       max_tokens: 50,
//     });

//     const captions = response.choices[0].message.content
//       .split("\n")
//       .filter((line) => line.trim());

//     return captions;
//   } catch (error) {
//     console.error("Error generating captions:", error);
//     throw error;
//   }
// }

router.post('/generate-captions', [
    body('imageUrl').isURL().withMessage("Image URL is required"),
], (req, res) => {
    try{
        const errors = validationResult(req);
        if(!errors.isEmpty()){
            return res.status(400).json({errors: errors.array()});
        }
        const imageUrl = req.body.imageUrl;
        const captions = [
            "When you finally debug that error after 5 hours",
            "That moment when you realize it's only Tuesday",
      
            "Nobody:\nMe at 3am looking for snacks:",
            "Me: I'll just check one notification\nAlso me: *3 hours later*",
      
            "Mondays be like...",
            "Expectation vs. Reality",
      
            "This sparks joy",
            "Tell me you're a programmer without telling me you're a programmer",
          ];

              // Uncomment this line to use the AI-generated captions
    // const AiCaptions = await generateMemeCaptions(imageUrl);
    // return NextResponse.json({ captions: AiCaptions });

    return res.status(200).json({captions});
    }catch(error){
        console.error(error);
        return res.status(500).json({error: "Internal Server Error"});
    }
});


module.exports = router;