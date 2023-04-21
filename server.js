// Import required modules
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const {
  ChatCompletionRequestMessageRoleEnum,
  ChatCompletionRequestMessage,
  Configuration,
  OpenAIApi,
} = require("openai");

// Create an Express app and configure it
const app = express();
const port = process.env.PORT || 3001;

// Enable CORS and use JSON middleware
app.use(cors());
app.use(express.json());

// Initialize OpenAI API client
const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

// Define the endpoint for assessing code quality
app.post("/assess-code-quality", async (req, res) => {
  const codeContent = req.body.code;

  const model = "gpt-3.5-turbo";
  const messages = [
    {
      role: ChatCompletionRequestMessageRoleEnum.System,
      content:
        "You are a helpful assistant that helps me determine the coding quality of a piece of code. Code is L1 if: Business logic is correct. Edge cases can be hit and miss. Code is L2 if the code shows that the engineer Writes easily testable  code by default. Understand and explain trade off of time /space complexity when opportunities  surface. Authors smaller units of code that are testable (eg functions).  Avoiding larger imperative code blocks. Use configuration instead of hard coded values or highlights when hard coding values but shouldn't. Code is L3 if the author writes idiomatic code in their chosen language. Handles failure and  errors correctly. Writes code that subscribes to certain design patterns. e.g. interface driven, type safety, layers of separations of         concerns, DDD, SOLID. Can articulate the reasoning for adopting a particular pattern in code. It is L4 code if it has articulate observability, secret  management and logging as part of the solution. Reflect them in code if have time. Can you please tell me which level this code reaches?",
    },
    {
      role: ChatCompletionRequestMessageRoleEnum.User,
      content: codeContent,
    },
  ];

  try {
    const response = await openai.createChatCompletion({
      model,
      messages,
    });
    res.json({ result: response.data.choices[0].message?.content });
  } catch (error) {
    res
      .status(500)
      .json({ error: "An error occurred while processing your request." });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
