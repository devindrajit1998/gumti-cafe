'use client';

import { useEffect, useRef } from 'react';

/**
 * Shared modal accessibility behaviors:
 * - Esc key closes the modal
 * - Tab focus is trapped inside the modal content
 * - Focus is restored to the previously focused element on close
 * - Body scroll is locked while the modal is open
 *
 * Usage:
 *   const { modalRef, handleKeyDown } = useModalAccessibility(isOpen, onClose);
 *   <div ref={modalRef} onKeyDown={handleKeyDown} ...>
 */
export function useModalAccessibility(isOpen: boolean, onClose: () => void) {
    const modalRef = useRef<HTMLDivElement>(null);
    const previouslyFocusedRef = useRef<HTMLElement | null>(null);

    // Esc-to-close, focus trap, focus restore, body scroll lock
    useEffect(() => {
        if (!isOpen) return;

        previouslyFocusedRef.current = document.activeElement as HTMLElement | null;

        const modal = modalRef.current;
        if (modal) {
            // Move initial focus into the modal (first focusable, else the container)
            const focusables = modal.querySelectorAll<HTMLElement>(
                'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
            );
            (focusables[0] || modal).focus();
        }

        const onKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                e.stopPropagation();
                onClose();
                return;
            }
            if (e.key === 'Tab' && modalRef.current) {
                const focusableElements = modalRef.current.querySelectorAll<HTMLElement>(
                    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
                );
                if (focusableElements.length === 0) return;
                const first = focusableElements[0];
                const last = focusableElements[focusableElements.length - 1];
                if (e.shiftKey && document.activeElement === first) {
                    e.preventDefault();
                    last.focus();
                } else if (!e.shiftKey && document.activeElement === last) {
                    e.preventDefault();
                    first.focus();
                }
            }
        };

        document.addEventListener('keydown', onKeyDown, true);
        const originalOverflow = document.body.style.overflow;
        document.body.style.overflow = 'hidden';

        return () => {
            document.removeEventListener('keydown', onKeyDown, true);
            document.body.style.overflow = originalOverflow;
            previouslyFocusedRef.current?.focus?.();
        };
    }, [isOpen, onClose]);

    return { modalRef };
}
