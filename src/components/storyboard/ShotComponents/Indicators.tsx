import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react';
import { IShot } from '@/types';
import { useStoryboard } from '@/context/StoryboardContext';
import { Tooltip } from '@/components/library';

interface Props {
  shot: IShot;
  index: number;
}

const Indicators = ({ shot, index }: Props) => {
  const { statuses, updateShotStatus, notSavedShotIds, flushDebouncedSaveShot } = useStoryboard();

  const handleStatusSelect = async (statusId: string | null) => {
    try {
      await updateShotStatus(shot.id, statusId);
    } catch (error) {
      console.error('Error updating shot status:', error);
    }
  };

  return (
    <div className="absolute -top-3 -left-3 flex items-center gap-1 z-10">
      <div className="w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center shadow-md">
        {index + 1}
      </div>
      {notSavedShotIds.has(shot.id) && (
        <div className="relative">
          <Tooltip content={notSavedShotIds.get(shot.id) === 'saving' ? 'Saving changes...' : 'Unsaved changes. Wait 1 min or click here to save changes'}>
            <button
              onClick={() => flushDebouncedSaveShot(shot.id)}
              disabled={notSavedShotIds.get(shot.id) === 'saving'}
              className={`w-6 h-6 rounded-full text-white flex items-center justify-center shadow-md transition-colors group/indicator ${
                notSavedShotIds.get(shot.id) === 'saving'
                  ? 'bg-yellow-400 cursor-not-allowed'
                  : 'bg-yellow-500 hover:bg-yellow-600 cursor-pointer'
              }`}
              title={notSavedShotIds.get(shot.id) === 'saving' ? 'Saving changes...' : 'Click to save changes'}
            >
              {notSavedShotIds.get(shot.id) === 'saving' ? (
                <svg className="animate-spin h-3 w-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
              )}
            </button>
          </Tooltip>
        </div>
      )}
      <Menu as="div" className="relative">
        <Tooltip content={`Status: ${shot.status?.name || 'No status'} (Click to change)`}>
          <MenuButton className="w-6 h-6 rounded-full relative group/status shadow-sm border border-gray-200 cursor-pointer">
            <div 
              className="w-full h-full rounded-full border-2 border-white"
              style={{ backgroundColor: shot.status?.color || '#6B7280' }}
            />
          </MenuButton>
        </Tooltip>
        <MenuItems className="absolute left-1/2 -translate-x-1/2 bg-white border border-gray-200 rounded-lg shadow-lg z-50 min-w-32 mt-2">
          <div className="py-1">
            {/* No status option */}
            <MenuItem>
              {({ active }) => (
                <button
                  onClick={() => handleStatusSelect(null)}
                  className={`${
                    active ? 'bg-gray-100' : ''
                  } w-full px-3 py-2 text-left text-sm flex items-center gap-2`}
                >
                  <div className="w-3 h-3 rounded-full bg-gray-400"></div>
                  <span>No status</span>
                </button>
              )}
            </MenuItem>
            {/* Available statuses */}
            {statuses.map((status) => (
              <MenuItem key={status.id}>
                {({ active }) => (
                  <button
                    onClick={() => handleStatusSelect(status.id)}
                    className={`${
                      active ? 'bg-gray-100' : ''
                    } w-full px-3 py-2 text-left text-sm flex items-center gap-2`}
                  >
                    <div 
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: status.color }}
                    ></div>
                    <span>{status.name}</span>
                  </button>
                )}
              </MenuItem>
            ))}
          </div>
        </MenuItems>
      </Menu>
    </div>
  )
}

export default Indicators
