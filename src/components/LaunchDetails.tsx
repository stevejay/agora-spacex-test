import { useId, useRef } from 'react';

import { LaunchSummary } from '@/api/spacexApi';

export function LaunchDetails({ details }: { details: LaunchSummary['details'] }) {
  const id = useId();
  const modalRef = useRef<HTMLDialogElement>(null);
  return (
    <>
      <button
        onClick={() => modalRef.current?.showModal()}
        disabled={!details}
        className="bg-slate-600 hover:bg-slate-700 disabled:text-slate-600 disabled:bg-slate-800 rounded px-4 py-2"
      >
        View rocket details
      </button>
      <dialog
        ref={modalRef}
        aria-labelledby={id}
        className="rounded p-4 shadow-xl bg-slate-800 text-slate-100 max-w-2xl space-y-6 text-left"
      >
        <h2 id={id} className="text-lg font-bold">
          Launch Details
        </h2>
        <p className="font-light">{details}</p>
        <button
          onClick={() => modalRef.current?.close()}
          className="bg-sky-600 hover:bg-sky-700 rounded px-4 py-2 w-full"
        >
          OK
        </button>
      </dialog>
    </>
  );
}
