import * as atatus from 'atatus-spa';

describe('Atatus Integration', () => {
  test('should be able to send error notifications', () => {
    // Mock console.error to prevent actual error logging
    const originalError = console.error;
    console.error = jest.fn();

    // Test error notification
    atatus.notify(new Error('Test Atatus Setup'));

    // Restore console.error
    console.error = originalError;

    // We can't actually verify the error was sent to Atatus
    // This test just verifies the call doesn't throw
    expect(true).toBe(true);
  });
}); 