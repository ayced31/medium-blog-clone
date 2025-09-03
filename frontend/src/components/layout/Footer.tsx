import { FC } from 'react';

export const Footer: FC = () => {
  return (
    <footer className="bg-white border-t border-gray-100">
      <div className="medium-container py-4">
        <div className="flex flex-wrap gap-4 text-sm text-gray-500 medium-sans">
          <a href="#" className="hover:text-gray-700">Help</a>
          <a href="#" className="hover:text-gray-700">Status</a>
          <a href="#" className="hover:text-gray-700">About</a>
          <a href="#" className="hover:text-gray-700">Careers</a>
          <a href="#" className="hover:text-gray-700">Privacy</a>
          <a href="#" className="hover:text-gray-700">Terms</a>
        </div>
      </div>
    </footer>
  );
};