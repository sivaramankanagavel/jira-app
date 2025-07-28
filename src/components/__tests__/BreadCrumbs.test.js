import { render, screen } from '@testing-library/react';
import BreadCrumbs from '../BreadCrumbs/BreadCrumbs';

describe('BreadCrumbs', () => {
  it('renders without crashing and contains the breadcrumbs class', () => {
    const { container } = render(<BreadCrumbs />);
    const breadcrumbsDiv = container.querySelector('.breadcrumbs');
    expect(breadcrumbsDiv).toBeInTheDocument();
    expect(breadcrumbsDiv).toHaveClass('h-100 w-90 d-flex align-items-center');
  });

  it('renders an empty div initially', () => {
    const { container } = render(<BreadCrumbs />);
    expect(container.firstChild).toBeEmptyDOMElement();
  });
});