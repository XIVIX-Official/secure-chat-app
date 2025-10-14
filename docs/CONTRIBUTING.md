# Contributing Guidelines

## Getting Started

1. **Fork the Repository**
   ```bash
   git clone https://github.com/your-username/secure-chat-app.git
   cd secure-chat-app
   ```

2. **Install Dependencies**
   ```bash
   # Install backend dependencies
   cd backend
   npm install

   # Install frontend dependencies
   cd ../frontend
   npm install
   ```

3. **Set Up Development Environment**
   - Copy `.env.example` to `.env` in both frontend and backend directories
   - Configure environment variables as needed

## Development Workflow

1. **Create a New Branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make Changes**
   - Follow the existing code style
   - Add tests for new features
   - Update documentation as needed

3. **Commit Changes**
   ```bash
   git add .
   git commit -m "feat: add new feature"
   ```

   Commit Message Format:
   - feat: New feature
   - fix: Bug fix
   - docs: Documentation changes
   - style: Code style changes
   - refactor: Code refactoring
   - test: Test changes
   - chore: Build changes, etc.

4. **Push Changes**
   ```bash
   git push origin feature/your-feature-name
   ```

5. **Create Pull Request**
   - Provide clear description
   - Reference related issues
   - Wait for code review

## Code Style Guidelines

1. **TypeScript**
   - Use TypeScript for all new code
   - Follow existing type definitions
   - Add proper interfaces/types

2. **React Components**
   - Functional components with hooks
   - Props interface definitions
   - Clear component structure

3. **Testing**
   - Unit tests for utilities
   - Integration tests for components
   - E2E tests for critical flows

4. **Documentation**
   - Clear function/method comments
   - Update README.md when needed
   - Add JSDoc where appropriate

## Security Guidelines

1. **Cryptographic Operations**
   - Use approved libraries only
   - Follow security best practices
   - Document security decisions

2. **Code Security**
   - No hardcoded secrets
   - Proper error handling
   - Input validation

3. **Dependencies**
   - Regular updates
   - Security audit reviews
   - Minimize dependencies

## Pull Request Process

1. Ensure all tests pass
2. Update documentation
3. Add change description
4. Get approval from maintainers
5. Merge after approval

## Code Review Guidelines

1. **Check for:**
   - Code quality
   - Test coverage
   - Documentation
   - Security considerations
   - Performance impact

2. **Review Process:**
   - Technical accuracy
   - Code style compliance
   - Security implications
   - Performance considerations

## Community Guidelines

1. Be respectful and inclusive
2. Follow code of conduct
3. Help other contributors
4. Provide constructive feedback

## Resources

- [Architecture Documentation](ARCHITECTURE.md)
- [Encryption Details](ENCRYPTION.md)
- [API Documentation](API.md)
- [Security Guidelines](SECURITY.md)