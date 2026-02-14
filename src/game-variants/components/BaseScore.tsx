import {useCallback, useEffect, useRef, useState} from "react";

interface BaseScoreProps extends React.HTMLAttributes<HTMLDivElement> {}

export default function BaseScore({
									  children,
									  className,
									  style,
									  onClick,
									  ...restProps
								  }: BaseScoreProps) {

	const divRef = useRef(null);
	const [isFocused, setIsFocused] = useState(false);

	useEffect(() => {
		const handleFocusIn = (event) => {
			// Prüfen, ob das aktuell fokussierte Element innerhalb unserer Box ist
			if (divRef.current && divRef.current.contains(event.target)) {
				setIsFocused(true);
			}
		};
		const handleFocusOut = (event) => {
			// Prüfen, ob der Fokus die Box verlassen hat
			if (divRef.current && !divRef.current.contains(event.relatedTarget)) {
				setIsFocused(false);
			}
		};

		// Event-Listener auf dem Dokument, um Fokuswechsel zu verfolgen
		document.addEventListener("focusin", handleFocusIn);
		document.addEventListener("focusout", handleFocusOut);

		return () => {
			document.removeEventListener("focusin", handleFocusIn);
			document.removeEventListener("focusout", handleFocusOut);
		};
	}, []);

	const handleClick = useCallback((event: React.MouseEvent<HTMLDivElement>) => {
		event.stopPropagation();
		divRef.current?.focus(); // Setzt den nativen Fokus auf das Div
		onClick?.(event); // Ruft den externen onClick-Handler auf, falls vorhanden
	}, [onClick]);

	const focusClass = isFocused ? "base-score--focused" : "";

	return (
		<div
			className={`base-score ${focusClass} ${className || ""}`}
			tabIndex={0}
			style={style}
			ref={divRef}
			onClick={handleClick}
			{...restProps}
		>
			{children}
		</div>
	);
}