import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import AutocompleteSearch from '../components/AutocompleteSearch';

// Mock fetch globally
global.fetch = jest.fn();

const defaultProps = {
    apiUrl: 'https://dummyjson.com/users/search?q=',
    searchKey: 'users',
    displayFields: ['firstName', 'lastName'],
    placeholder: 'Search names...',
    itemsLimit: 5,
    onSelect: jest.fn()
};

describe('AutocompleteSearch', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('Basic Rendering', () => {
        test('renders input with correct placeholder', () => {
            render(<AutocompleteSearch {...defaultProps} />);
            expect(screen.getByPlaceholderText('Search names...')).toBeInTheDocument();
        });
    });

    describe('Search Functionality', () => {
        test('shows no results message when API returns empty array', async () => {
            // Mock API response with empty results
            fetch.mockImplementationOnce(() =>
                Promise.resolve({
                    json: () => Promise.resolve({ users: [] })
                })
            );

            render(<AutocompleteSearch {...defaultProps} />);

            // Get input and trigger change
            const input = screen.getByPlaceholderText('Search names...');
            fireEvent.change(input, { target: { value: 'xyz' } });

            // Wait for no results message
            await waitFor(() => {
                expect(screen.getByText('No Results Found')).toBeInTheDocument();
            });
        });

        test('displays results when API returns data', async () => {
            const mockData = {
                users: [
                    { id: 1, firstName: 'John', lastName: 'Doe' },
                    { id: 2, firstName: 'Jane', lastName: 'Smith' }
                ]
            };

            fetch.mockImplementationOnce(() =>
                Promise.resolve({
                    json: () => Promise.resolve(mockData)
                })
            );

            render(<AutocompleteSearch {...defaultProps} />);

            const input = screen.getByPlaceholderText('Search names...');
            fireEvent.change(input, { target: { value: 'jo' } });

            await waitFor(() => {
                expect(screen.getByText('John Doe')).toBeInTheDocument();
                expect(screen.getByText('Jane Smith')).toBeInTheDocument();
            });
        });

        test('handles API errors gracefully', async () => {
            fetch.mockImplementationOnce(() => Promise.reject('API Error'));

            render(<AutocompleteSearch {...defaultProps} />);

            const input = screen.getByPlaceholderText('Search names...');
            fireEvent.change(input, { target: { value: 'test' } });

            await waitFor(() => {
                expect(screen.getByText('No Results Found')).toBeInTheDocument();
            });
        });
    });

    describe('Selection Functionality', () => {
        test('calls onSelect when item is clicked', async () => {
            const mockData = {
                users: [{ id: 1, firstName: 'John', lastName: 'Doe' }]
            };

            fetch.mockImplementationOnce(() =>
                Promise.resolve({
                    json: () => Promise.resolve(mockData)
                })
            );

            render(<AutocompleteSearch {...defaultProps} />);

            // Type in search
            const input = screen.getByPlaceholderText('Search names...');
            fireEvent.change(input, { target: { value: 'jo' } });

            // Wait for and click result
            await waitFor(() => {
                const result = screen.getByText('John Doe');
                fireEvent.click(result);
            });

            expect(defaultProps.onSelect).toHaveBeenCalledWith(mockData.users[0]);
        });

        // Additional test for input clearing
        test('clears results when input is cleared', async () => {
            const mockData = {
                users: [{ id: 1, firstName: 'John', lastName: 'Doe' }]
            };

            fetch.mockImplementationOnce(() =>
                Promise.resolve({
                    json: () => Promise.resolve(mockData)
                })
            );

            render(<AutocompleteSearch {...defaultProps} />);

            const input = screen.getByPlaceholderText('Search names...');

            // Type search
            fireEvent.change(input, { target: { value: 'jo' } });

            // Wait for results
            await waitFor(() => {
                expect(screen.getByText('John Doe')).toBeInTheDocument();
            });

            // Clear input
            fireEvent.change(input, { target: { value: '' } });

            // Check results are cleared
            expect(screen.queryByText('John Doe')).not.toBeInTheDocument();
        });
    });

});