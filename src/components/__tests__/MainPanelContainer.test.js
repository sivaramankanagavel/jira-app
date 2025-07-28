import React from 'react';
import { render, screen } from '@testing-library/react';
import MainPanelContainer from '../Main-Panel-Container/MainPanelContainer';

describe('MainPanelContainer', () => {
  it('renders children correctly', () => {
    render(
      <MainPanelContainer>
        <div>Test Child Content</div>
      </MainPanelContainer>
    );
    expect(screen.getByText('Test Child Content')).toBeInTheDocument();
  });

  it('applies correct CSS classes', () => {
    const { container } = render(<MainPanelContainer />);
    expect(container.firstChild).toHaveClass('h-100 row d-flex flex-wrap w-100 p-0 m-auto');
  });
});