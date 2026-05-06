import { StarIcon } from 'lucide-react';

function StarRatingComponent({ rating, handleRatingChange }) {
  console.log(rating,"rating")
  return (
    <div className="flex gap-2">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => handleRatingChange?.(star)}
          className={`p-2 rounded-full transition ${
            star <= rating
              ? 'text-yellow-500 hover:bg-black'
              : 'text-black hover:bg-primary hover:text-primary-foreground'
          }`}
        >
          <StarIcon
            size={20}
            className={`w-6 h-6 ${star <= rating ? 'fill-yellow-500' : 'fill-black'}`}
          />
        </button>
      ))}
    </div>
  );
}

export default StarRatingComponent;
