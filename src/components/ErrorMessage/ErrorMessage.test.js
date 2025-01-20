import { jsx as _jsx } from 'react/jsx-runtime';
import { render, screen, fireEvent } from '@testing-library/react';
import ErrorMessage from './ErrorMessage';
jest.mock('./ErrorMessage.module.css', () => ({
  errorContainer: 'errorContainer',
  errorMessage: 'errorMessage',
  retryButton: 'retryButton',
}));
describe('ErrorMessage Component', () => {
  const mockMessage = 'An error occurred. Please try again.';
  const mockRetryAction = jest.fn();
  it('renders the error message', () => {
    render(_jsx(ErrorMessage, { message: mockMessage }));
    const messageElement = screen.getByText(mockMessage);
    expect(messageElement).toBeInTheDocument();
    expect(messageElement).toHaveClass('errorMessage');
  });
  it('renders the retry button when retryAction is provided', () => {
    render(
      _jsx(ErrorMessage, { message: mockMessage, retryAction: mockRetryAction })
    );
    const buttonElement = screen.getByRole('button', { name: /retry/i });
    expect(buttonElement).toBeInTheDocument();
    expect(buttonElement).toHaveClass('retryButton');
  });
  it('does not render the retry button when retryAction is not provided', () => {
    render(_jsx(ErrorMessage, { message: mockMessage }));
    const buttonElement = screen.queryByRole('button', { name: /retry/i });
    expect(buttonElement).not.toBeInTheDocument();
  });
  it('calls retryAction when the retry button is clicked', () => {
    render(
      _jsx(ErrorMessage, { message: mockMessage, retryAction: mockRetryAction })
    );
    const buttonElement = screen.getByRole('button', { name: /retry/i });
    fireEvent.click(buttonElement);
    expect(mockRetryAction).toHaveBeenCalledTimes(1);
  });
});
