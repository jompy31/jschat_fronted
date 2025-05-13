import { Button } from 'react-bootstrap';

export const renderPaginationButtons = (currentPage, totalPages, setCurrentPage) => {
  const buttons = [];
  for (let i = 1; i <= totalPages; i++) {
    buttons.push(
      <Button
        key={i}
        variant={i === currentPage ? 'primary' : 'secondary'}
        onClick={() => setCurrentPage(i)}
      >
        {i}
      </Button>
    );
  }
  return buttons;
};