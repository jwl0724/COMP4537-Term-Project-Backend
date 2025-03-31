# COMP4537-Term-Project-Backend

The backend for the webapp where you talk to Spongebob. You can try it [here](https://comp-4537-term-project-frontend-three.vercel.app/).

MySQL is used for the database because of familiarity and ease of use.

Repository class acts as a Facade to delegate data operations to the Database class.

This project uses Gemini AI as the SpongeBob chatbot to replicate how SpongeBob would interact with users.

Chat sessions are per user and are deleted once the user logs out or after 1 hour.

FakeYou text-to-speech service is used to mimic how SpongeBob would sound.

Authentication is handled using hashed passwords with bcryptjs, JWTs for token generation, and secure HTTP-only cookies for session management.

Forgot password and reset password flow is handled using nodemailer. Reset tokens are stored locally in memory and expire/deleted after 5 minutes.

Swagger UI is used to document the API endpoints. It is located [here](https://term-project-metdh.ondigitalocean.app/docs/).

# Dev Instructions:

1. npm i
2. npm run dev
3. Login/Signup first to create a token, allows you to use the rest of the API endpoints. /forgot-password and /reset do not require a token to use.

This project was assisted by ChatGPT, OpenAI.
