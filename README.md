# Auri - Personal Finance Manager

A modern, intuitive personal finance management application built with Next.js and TypeScript. Auri helps you track, manage, and analyze your financial transactions with ease.

## Features

- 💰 Transaction management
- 📊 Financial insights and analytics
- 📱 Responsive design for all devices
- 🌓 Light and dark mode
- 🔄 CSV transaction import
- 🏷 Categorization of expenses
- 🎨 Modern UI built with Radix UI and Tailwind CSS

## Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Radix UI, Lucide Icons
- **State Management**: Zustand
- **Form Handling**: React Hook Form with Zod validation
- **Database**: Prisma ORM
- **AI Integration**: OpenAI API for smart categorization

## Getting Started

1. **Clone the repository**
   ```bash
   git clone https://github.com/DeckardGer/Auri-Personal-Finance-Manager.git
   cd Auri-Personal-Finance-Manager
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env` file in the root directory and add the following:
   ```env
   # SQLite database connection
   DATABASE_URL="file:./dev.db"
   
   # OpenAI API key for transaction categorization (optional)
   # OPENAI_API_KEY="your_openai_api_key"
   ```
   
   For SQLite, the database file will be created automatically in your project root when you run the database setup commands.

4. **Set up the database**
   ```bash
   npx prisma generate
   npx prisma db push
   ```

5. **Run the development server**
   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Scripts

- `npm run dev` - Start the development server
- `npm run build` - Build for production
- `npm start` - Start the production server
- `npm run lint` - Run ESLint
- `npm run format` - Format code with Prettier

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the terms of the [MIT license](LICENSE).
