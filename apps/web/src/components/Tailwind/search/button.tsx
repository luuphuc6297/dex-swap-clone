import { SearchIcon } from 'components/Tailwind/icons/search';
import { useModal } from 'components/Tailwind/modal-views/context';
import Button from 'components/Tailwind/ui/button';

export default function SearchButton({ ...props }) {
  const { openModal } = useModal();
  return (
    <Button
      shape="circle"
      aria-label="Search"
      onClick={() => openModal('SEARCH_VIEW')}
      {...props}
    >
      <SearchIcon className="h-auto w-3.5 sm:w-auto" />
    </Button>
  );
}
