import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import Pagination from '../pages/Pagination';

const mockPosts = {
    posts: [
        { id: 1, title: 'Test Post 1', body: 'Test body 1' },
        { id: 2, title: 'Test Post 2', body: 'Test body 2' },
    ],
    total: 30
};

// Mock fetch globally
global.fetch = jest.fn();

describe('Pagination Component Tests', () => {
    beforeEach(() => {
        fetch.mockReset();
    });

    describe('1. Unit Tests', () => {
        test('1.1 displays loading state initially', async () => {
            // Setup mock API response with delay to ensure loading state is caught
            fetch.mockImplementationOnce(() =>
                new Promise(resolve =>
                    setTimeout(() => {
                        resolve({
                            json: () => Promise.resolve(mockPosts)
                        });
                    }, 100)
                )
            );

            // Wrap render in act
            await act(async () => {
                render(<Pagination />);
            });

            // Check loading state
            expect(screen.getByText('Loading...')).toBeInTheDocument();
        });

        test('1.2 renders correct number of pagination buttons', async () => {
            fetch.mockImplementationOnce(() =>
                Promise.resolve({
                    json: () => Promise.resolve(mockPosts)
                })
            );

            await act(async () => {
                render(<Pagination />);
            });

            await waitFor(() => {
                const paginationButtons = screen.getAllByRole('button');
                const expectedButtons = Math.ceil(mockPosts.total / 10);
                expect(paginationButtons).toHaveLength(expectedButtons);
            });
        });

        test('1.3 renders posts correctly', async () => {
            fetch.mockImplementationOnce(() =>
                Promise.resolve({
                    json: () => Promise.resolve(mockPosts)
                })
            );

            await act(async () => {
                render(<Pagination />);
            });

            await waitFor(() => {
                expect(screen.getByText('Test Post 1')).toBeInTheDocument();
                expect(screen.getByText('Test Post 2')).toBeInTheDocument();
            });
        });
    });

    describe('2. Integration Tests', () => {
        test('2.1 fetches and updates data when page changes', async () => {
            const mockPage2Posts = {
                posts: [
                    { id: 3, title: 'Test Post 3', body: 'Test body 3' },
                    { id: 4, title: 'Test Post 4', body: 'Test body 4' },
                ],
                total: 30
            };

            fetch
                .mockImplementationOnce(() => Promise.resolve({
                    json: () => Promise.resolve(mockPosts)
                }))
                .mockImplementationOnce(() => Promise.resolve({
                    json: () => Promise.resolve(mockPage2Posts)
                }));

            await act(async () => {
                render(<Pagination />);
            });

            // Wait for initial render
            await waitFor(() => {
                expect(screen.getByText('Test Post 1')).toBeInTheDocument();
            });

            // Click second page button
            await act(async () => {
                fireEvent.click(screen.getAllByRole('button')[1]);
            });

            // Verify new page content
            await waitFor(() => {
                expect(screen.getByText('Test Post 3')).toBeInTheDocument();
                expect(screen.getByText('Test Post 4')).toBeInTheDocument();
            });
        });

        test('2.2 handles API error gracefully', async () => {
            const consoleLogSpy = jest.spyOn(console, 'log').mockImplementation();

            fetch.mockImplementationOnce(() =>
                Promise.reject(new Error('API Error'))
            );

            await act(async () => {
                render(<Pagination />);
            });

            await waitFor(() => {
                expect(consoleLogSpy).toHaveBeenCalledWith(expect.any(Error));
            });

            consoleLogSpy.mockRestore();
        });
    });

    describe('3. Edge Cases', () => {
        test('3.1 handles empty data array', async () => {
            fetch.mockImplementationOnce(() =>
                Promise.resolve({
                    json: () => Promise.resolve({ posts: [], total: 0 })
                })
            );

            await act(async () => {
                render(<Pagination />);
            });

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

            await act(async () => {
                render(<Pagination />);
            });

            await waitFor(() => {
                const post = screen.getByRole('article');
                expect(post).toBeInTheDocument();
            });
        });
    });
});