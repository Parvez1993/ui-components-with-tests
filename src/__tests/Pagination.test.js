// Pagination.test.jsx
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import Pagination from '../pages/Pagination';

/**
 * Mock Data Setup
 * --------------
 * We use these mock objects to simulate API responses
 */
const mockPosts = {
    posts: [
        { id: 1, title: 'Test Post 1', body: 'Test body 1' },
        { id: 2, title: 'Test Post 2', body: 'Test body 2' },
    ],
    total: 30
};

// Mock fetch globally before all tests
global.fetch = jest.fn();

describe('Pagination Component Tests', () => {
    // Reset mocks before each test to ensure clean state
    beforeEach(() => {
        fetch.mockReset();
    });

    /**
     * Unit Tests
     * ----------
     * Testing individual component behaviors in isolation
     */
    describe('1. Unit Tests', () => {
        /**
         * Test: Initial Loading State
         * Purpose: Verify that loading indicator appears when component mounts
         */
        test('1.1 displays loading state initially', () => {
            // Setup mock API response
            fetch.mockImplementationOnce(() =>
                Promise.resolve({
                    json: () => Promise.resolve(mockPosts)
                })
            );

            // Render component
            render(<Pagination />);

            // Assert loading state
            expect(screen.getByText('Loading...')).toBeInTheDocument();
        });

        /**
         * Test: Pagination Buttons Rendering
         * Purpose: Verify correct number of pagination buttons are rendered
         */
        test('1.2 renders correct number of pagination buttons', async () => {
            fetch.mockImplementationOnce(() =>
                Promise.resolve({
                    json: () => Promise.resolve(mockPosts)
                })
            );

            render(<Pagination />);

            // Wait for and verify pagination buttons
            await waitFor(() => {
                const paginationButtons = screen.getAllByRole('button');
                const expectedButtons = Math.ceil(mockPosts.total / 10);
                expect(paginationButtons).toHaveLength(expectedButtons);
            });
        });

        /**
         * Test: Post Content Rendering
         * Purpose: Verify posts are rendered correctly with their titles
         */
        test('1.3 renders posts correctly', async () => {
            fetch.mockImplementationOnce(() =>
                Promise.resolve({
                    json: () => Promise.resolve(mockPosts)
                })
            );

            render(<Pagination />);

            // Verify post content
            await waitFor(() => {
                expect(screen.getByText('Test Post 1')).toBeInTheDocument();
                expect(screen.getByText('Test Post 2')).toBeInTheDocument();
            });
        });
    });

    /**
     * Integration Tests
     * ----------------
     * Testing component interactions and data flow
     */
    describe('2. Integration Tests', () => {
        /**
         * Test: Page Navigation
         * Purpose: Verify data updates when navigating between pages
         */
        test('2.1 fetches and updates data when page changes', async () => {
            // Mock data for second page
            const mockPage2Posts = {
                posts: [
                    { id: 3, title: 'Test Post 3', body: 'Test body 3' },
                    { id: 4, title: 'Test Post 4', body: 'Test body 4' },
                ],
                total: 30
            };

            // Setup sequential mock responses
            fetch
                .mockImplementationOnce(() => Promise.resolve({
                    json: () => Promise.resolve(mockPosts)
                }))
                .mockImplementationOnce(() => Promise.resolve({
                    json: () => Promise.resolve(mockPage2Posts)
                }));

            render(<Pagination />);

            // Wait for initial render
            await waitFor(() => {
                expect(screen.getByText('Test Post 1')).toBeInTheDocument();
            });

            // Trigger page navigation
            const secondPageButton = screen.getAllByRole('button')[1];
            fireEvent.click(secondPageButton);

            // Verify new page content
            await waitFor(() => {
                expect(screen.getByText('Test Post 3')).toBeInTheDocument();
                expect(screen.getByText('Test Post 4')).toBeInTheDocument();
            });
        });

        /**
         * Test: Error Handling
         * Purpose: Verify component handles API errors gracefully
         */
        test('2.2 handles API error gracefully', async () => {
            // Mock API error
            fetch.mockImplementationOnce(() =>
                Promise.reject(new Error('API Error'))
            );

            const consoleSpy = jest.spyOn(console, 'log');
            render(<Pagination />);

            await waitFor(() => {
                expect(consoleSpy).toHaveBeenCalledWith(expect.any(Error));
            });

            consoleSpy.mockRestore();
        });
    });

    /**
     * Edge Cases
     * ----------
     * Testing boundary conditions and error scenarios
     */
    describe('3. Edge Cases', () => {
        test('3.1 handles empty data array', async () => {
            fetch.mockImplementationOnce(() =>
                Promise.resolve({
                    json: () => Promise.resolve({ posts: [], total: 0 })
                })
            );

            render(<Pagination />);

            await waitFor(() => {
                const posts = screen.queryAllByRole('article');
                expect(posts).toHaveLength(0);
            });
        });

        test('3.2 handles undefined/null post properties', async () => {
            const mockInvalidPosts = {
                posts: [{ id: 1, title: null, body: undefined }],
                total: 1
            };

            fetch.mockImplementationOnce(() =>
                Promise.resolve({
                    json: () => Promise.resolve(mockInvalidPosts)
                })
            );

            render(<Pagination />);

            await waitFor(() => {
                const post = screen.getByRole('article');
                expect(post).toBeInTheDocument();
            });
        });
    });
});