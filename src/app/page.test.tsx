import '@testing-library/jest-dom'
import * as React from 'react'

import { render, screen } from '@testing-library/react';
import Home from './page'; // Import your component

describe('Home Component', () => {
  it('renders the home page content correctly', () => {
    render(<Home />); // Render the component

    // Assertions
    expect(screen.getByRole('heading', { name: 'Welcome to Smart Health Links Portal!' })).toBeInTheDocument();
    expect(screen.getByText('Share you medical data with confidence')).toBeInTheDocument();

    // Optional: Check if the icon is rendered
    // You'll need to decide how you want to identify the icon (e.g., by class name, aria-label, etc.)
    expect(screen.getByTestId('MonitorHeartOutlinedIcon')).toBeInTheDocument(); 
  });
});