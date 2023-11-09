import Loader, {
  LoaderSizeTypes,
  LoaderVariantTypes,
} from 'components/Tailwind/ui/loader';

export default function ButtonLoader({
  size,
  variant,
}: {
  size: LoaderSizeTypes;
  variant: LoaderVariantTypes;
}) {
  return (
    <span className="absolute inset-0 h-full w-full flex items-center justify-center">
      <Loader
        tag="span"
        size={size}
        variant={variant}
        showOnlyThreeDots
      />
    </span>
  );
}

ButtonLoader.displayName = 'ButtonLoader';
