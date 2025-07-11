import React from 'react';
import { renderHook } from '@testing-library/react';
import { useScrollBottomReached } from '@/hooks/useScrollBottomReached';

describe('useScrollBottomReached', () => {
  let mockContainer: React.RefObject<HTMLElement>;
  let mockElement: HTMLElement;
  let mockCallback: jest.Mock;

  beforeEach(() => {
    mockCallback = jest.fn();
    mockElement = document.createElement('div');
    mockContainer = { current: mockElement };

    // Mock scroll properties
    Object.defineProperty(mockElement, 'scrollTop', {
      value: 0,
      writable: true,
    });
    Object.defineProperty(mockElement, 'clientHeight', {
      value: 100,
      writable: true,
    });
    Object.defineProperty(mockElement, 'scrollHeight', {
      value: 200,
      writable: true,
    });

    // Mock addEventListener and removeEventListener
    (mockElement as any).addEventListener = jest.fn();
    (mockElement as any).removeEventListener = jest.fn();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('Initialization', () => {
    it('should add scroll event listener on mount', () => {
      renderHook(() => useScrollBottomReached(mockContainer, mockCallback));

      expect(mockElement.addEventListener).toHaveBeenCalledWith('scroll', expect.any(Function));
    });

    it('should not add event listener when container is null', () => {
      const nullContainer: React.RefObject<HTMLElement | null> = { current: null };
      renderHook(() => useScrollBottomReached(nullContainer, mockCallback));

      expect(mockElement.addEventListener).not.toHaveBeenCalled();
    });

    it('should remove event listener on unmount', () => {
      const { unmount } = renderHook(() => useScrollBottomReached(mockContainer, mockCallback));

      unmount();

      expect(mockElement.removeEventListener).toHaveBeenCalledWith('scroll', expect.any(Function));
    });

    it('should not remove event listener when container is null', () => {
      const nullContainer: React.RefObject<HTMLElement | null> = { current: null };
      const { unmount } = renderHook(() => useScrollBottomReached(nullContainer, mockCallback));

      unmount();

      expect(mockElement.removeEventListener).not.toHaveBeenCalled();
    });
  });

  describe('Scroll Detection', () => {
    it('should call callback when scroll reaches bottom', () => {
      renderHook(() => useScrollBottomReached(mockContainer, mockCallback));

      // Simulate scroll to bottom
      Object.defineProperty(mockElement, 'scrollTop', { value: 100 });
      Object.defineProperty(mockElement, 'clientHeight', { value: 100 });
      Object.defineProperty(mockElement, 'scrollHeight', { value: 200 });

      const scrollHandler = (mockElement.addEventListener as any).mock.calls[0][1];
      scrollHandler();

      expect(mockCallback).toHaveBeenCalledTimes(1);
    });

    it('should call callback when scroll is at bottom with offset', () => {
      renderHook(() => useScrollBottomReached(mockContainer, mockCallback, 50));

      // Simulate scroll near bottom with offset
      Object.defineProperty(mockElement, 'scrollTop', { value: 50 });
      Object.defineProperty(mockElement, 'clientHeight', { value: 100 });
      Object.defineProperty(mockElement, 'scrollHeight', { value: 200 });

      const scrollHandler = (mockElement.addEventListener as any).mock.calls[0][1];
      scrollHandler();

      expect(mockCallback).toHaveBeenCalledTimes(1);
    });

    it('should not call callback when scroll is not at bottom', () => {
      renderHook(() => useScrollBottomReached(mockContainer, mockCallback));

      // Simulate scroll not at bottom
      Object.defineProperty(mockElement, 'scrollTop', { value: 50 });
      Object.defineProperty(mockElement, 'clientHeight', { value: 100 });
      Object.defineProperty(mockElement, 'scrollHeight', { value: 200 });

      const scrollHandler = (mockElement.addEventListener as any).mock.calls[0][1];
      scrollHandler();

      expect(mockCallback).not.toHaveBeenCalled();
    });

    it('should not call callback when scroll is not at bottom with offset', () => {
      renderHook(() => useScrollBottomReached(mockContainer, mockCallback, 50));

      // Simulate scroll not near bottom with offset
      Object.defineProperty(mockElement, 'scrollTop', { value: 25 });
      Object.defineProperty(mockElement, 'clientHeight', { value: 100 });
      Object.defineProperty(mockElement, 'scrollHeight', { value: 200 });

      const scrollHandler = (mockElement.addEventListener as any).mock.calls[0][1];
      scrollHandler();

      expect(mockCallback).not.toHaveBeenCalled();
    });

    it('should call callback when scrollTop + clientHeight equals scrollHeight', () => {
      renderHook(() => useScrollBottomReached(mockContainer, mockCallback));

      // Exact bottom
      Object.defineProperty(mockElement, 'scrollTop', { value: 100 });
      Object.defineProperty(mockElement, 'clientHeight', { value: 100 });
      Object.defineProperty(mockElement, 'scrollHeight', { value: 200 });

      const scrollHandler = (mockElement.addEventListener as any).mock.calls[0][1];
      scrollHandler();

      expect(mockCallback).toHaveBeenCalledTimes(1);
    });

    it('should call callback when scrollTop + clientHeight exceeds scrollHeight', () => {
      renderHook(() => useScrollBottomReached(mockContainer, mockCallback));

      // Past bottom
      Object.defineProperty(mockElement, 'scrollTop', { value: 150 });
      Object.defineProperty(mockElement, 'clientHeight', { value: 100 });
      Object.defineProperty(mockElement, 'scrollHeight', { value: 200 });

      const scrollHandler = (mockElement.addEventListener as any).mock.calls[0][1];
      scrollHandler();

      expect(mockCallback).toHaveBeenCalledTimes(1);
    });
  });

  describe('Callback Updates', () => {
    it('should use updated callback when callback changes', () => {
      const { rerender } = renderHook(
        ({ callback }) => useScrollBottomReached(mockContainer, callback),
        { initialProps: { callback: mockCallback } }
      );

      const newCallback = jest.fn();
      rerender({ callback: newCallback });

      // Simulate scroll to bottom
      Object.defineProperty(mockElement, 'scrollTop', { value: 100 });
      Object.defineProperty(mockElement, 'clientHeight', { value: 100 });
      Object.defineProperty(mockElement, 'scrollHeight', { value: 200 });

      const scrollHandler = (mockElement.addEventListener as any).mock.calls[0][1];
      scrollHandler();

      expect(newCallback).toHaveBeenCalledTimes(1);
      expect(mockCallback).not.toHaveBeenCalled();
    });

  });

  describe('Offset Handling', () => {
    it('should handle zero offset', () => {
      renderHook(() => useScrollBottomReached(mockContainer, mockCallback, 0));

      // Simulate scroll to exact bottom
      Object.defineProperty(mockElement, 'scrollTop', { value: 100 });
      Object.defineProperty(mockElement, 'clientHeight', { value: 100 });
      Object.defineProperty(mockElement, 'scrollHeight', { value: 200 });

      const scrollHandler = (mockElement.addEventListener as any).mock.calls[0][1];
      scrollHandler();

      expect(mockCallback).toHaveBeenCalledTimes(1);
    });

    it('should handle positive offset', () => {
      renderHook(() => useScrollBottomReached(mockContainer, mockCallback, 25));

      // Simulate scroll near bottom with offset
      Object.defineProperty(mockElement, 'scrollTop', { value: 75 });
      Object.defineProperty(mockElement, 'clientHeight', { value: 100 });
      Object.defineProperty(mockElement, 'scrollHeight', { value: 200 });

      const scrollHandler = (mockElement.addEventListener as any).mock.calls[0][1];
      scrollHandler();

      expect(mockCallback).toHaveBeenCalledTimes(1);
    });

    it('should handle large offset', () => {
      renderHook(() => useScrollBottomReached(mockContainer, mockCallback, 100));

      // Simulate scroll with large offset
      Object.defineProperty(mockElement, 'scrollTop', { value: 0 });
      Object.defineProperty(mockElement, 'clientHeight', { value: 100 });
      Object.defineProperty(mockElement, 'scrollHeight', { value: 200 });

      const scrollHandler = (mockElement.addEventListener as any).mock.calls[0][1];
      scrollHandler();

      expect(mockCallback).toHaveBeenCalledTimes(1);
    });

    it('should handle negative offset', () => {
      renderHook(() => useScrollBottomReached(mockContainer, mockCallback, -25));

      // Simulate scroll past bottom with negative offset
      Object.defineProperty(mockElement, 'scrollTop', { value: 125 });
      Object.defineProperty(mockElement, 'clientHeight', { value: 100 });
      Object.defineProperty(mockElement, 'scrollHeight', { value: 200 });

      const scrollHandler = (mockElement.addEventListener as any).mock.calls[0][1];
      scrollHandler();

      expect(mockCallback).toHaveBeenCalledTimes(1);
    });
  });

  describe('Edge Cases', () => {

    it('should handle container becoming available after mount', () => {
      const nullContainer: React.RefObject<HTMLElement | null> = { current: null };
      const { rerender } = renderHook(
        ({ container }) => useScrollBottomReached(container, mockCallback),
        { initialProps: { container: nullContainer } }
      );

      // Change container to valid element
      rerender({ container: mockContainer });

      // Should add event listener
      expect(mockElement.addEventListener).toHaveBeenCalledWith('scroll', expect.any(Function));
    });

    it('should handle zero clientHeight', () => {
      Object.defineProperty(mockElement, 'clientHeight', { value: 0 });

      renderHook(() => useScrollBottomReached(mockContainer, mockCallback));

      const scrollHandler = (mockElement.addEventListener as any).mock.calls[0][1];
      scrollHandler();

      expect(mockCallback).not.toHaveBeenCalled();
    });

    it('should handle very large scroll values', () => {
      renderHook(() => useScrollBottomReached(mockContainer, mockCallback));

      // Very large values
      Object.defineProperty(mockElement, 'scrollTop', { value: 1000000 });
      Object.defineProperty(mockElement, 'clientHeight', { value: 1000000 });
      Object.defineProperty(mockElement, 'scrollHeight', { value: 2000000 });

      const scrollHandler = (mockElement.addEventListener as any).mock.calls[0][1];
      scrollHandler();

      expect(mockCallback).toHaveBeenCalledTimes(1);
    });

    it('should handle decimal scroll values', () => {
      renderHook(() => useScrollBottomReached(mockContainer, mockCallback));

      // Decimal values
      Object.defineProperty(mockElement, 'scrollTop', { value: 99.5 });
      Object.defineProperty(mockElement, 'clientHeight', { value: 100.5 });
      Object.defineProperty(mockElement, 'scrollHeight', { value: 200 });

      const scrollHandler = (mockElement.addEventListener as any).mock.calls[0][1];
      scrollHandler();

      expect(mockCallback).toHaveBeenCalledTimes(1);
    });
  });

  describe('Multiple Calls', () => {
    it('should call callback multiple times when scrolling to bottom repeatedly', () => {
      renderHook(() => useScrollBottomReached(mockContainer, mockCallback));

      const scrollHandler = (mockElement.addEventListener as any).mock.calls[0][1];

      // First scroll to bottom
      Object.defineProperty(mockElement, 'scrollTop', { value: 100 });
      Object.defineProperty(mockElement, 'clientHeight', { value: 100 });
      Object.defineProperty(mockElement, 'scrollHeight', { value: 200 });
      scrollHandler();

      // Second scroll to bottom
      Object.defineProperty(mockElement, 'scrollTop', { value: 100 });
      scrollHandler();

      expect(mockCallback).toHaveBeenCalledTimes(2);
    });

    it('should not call callback when scrolling away from bottom', () => {
      renderHook(() => useScrollBottomReached(mockContainer, mockCallback));

      const scrollHandler = (mockElement.addEventListener as any).mock.calls[0][1];

      // Scroll to bottom
      Object.defineProperty(mockElement, 'scrollTop', { value: 100 });
      Object.defineProperty(mockElement, 'clientHeight', { value: 100 });
      Object.defineProperty(mockElement, 'scrollHeight', { value: 200 });
      scrollHandler();

      // Scroll away from bottom
      Object.defineProperty(mockElement, 'scrollTop', { value: 50 });
      scrollHandler();

      expect(mockCallback).toHaveBeenCalledTimes(1);
    });
  });

  describe('Cleanup', () => {
    it('should clean up event listener on unmount', () => {
      const { unmount } = renderHook(() => useScrollBottomReached(mockContainer, mockCallback));

      unmount();

      expect(mockElement.removeEventListener).toHaveBeenCalledWith('scroll', expect.any(Function));
    });

    it('should clean up when container changes', () => {
      const { rerender } = renderHook(
        ({ container }) => useScrollBottomReached(container, mockCallback),
        { initialProps: { container: mockContainer } }
      );

      const newContainer = { current: document.createElement('div') };
      newContainer.current!.addEventListener = jest.fn();
      newContainer.current!.removeEventListener = jest.fn();

      rerender({ container: newContainer });

      expect(mockElement.removeEventListener).toHaveBeenCalledWith('scroll', expect.any(Function));
      expect(newContainer.current!.addEventListener).toHaveBeenCalledWith('scroll', expect.any(Function));
    });

    it('should not call removeEventListener when container was null', () => {
      const nullContainer: React.RefObject<HTMLElement | null> = { current: null };
      const { rerender } = renderHook(
        ({ container }) => useScrollBottomReached(container, mockCallback),
        { initialProps: { container: nullContainer } }
      );

      rerender({ container: mockContainer });

      expect(mockElement.removeEventListener).not.toHaveBeenCalled();
    });
  });
}); 