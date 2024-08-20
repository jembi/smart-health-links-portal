import '@testing-library/jest-dom'

import { render, screen } from '@testing-library/react';
import PatientSummaryViewer from './page'; // Import your component

describe('PatientSummaryViewer Component', () => {
  it('renders the PatientSummaryViewer content correctly', () => {
    render(<PatientSummaryViewer />); // Render the component

    // Assertions
    expect(screen.getByRole('heading', { name: 'Patient Summary Viewer: Patient: John Snow' })).toBeInTheDocument();
  });
});