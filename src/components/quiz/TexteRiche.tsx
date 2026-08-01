interface Props {
  children: string;
}

// Les énoncés n'utilisent que deux notations : `code` et **gras**.
// Un moteur markdown complet serait démesuré pour ça.
const NOTATIONS = /(`[^`]+`|\*\*[^*]+\*\*)/g;

export default function TexteRiche({ children }: Props) {
  return (
    <>
      {children.split(NOTATIONS).map((morceau, i) => {
        if (morceau.startsWith('`') && morceau.endsWith('`') && morceau.length > 2) {
          return (
            <code
              key={i}
              className="rounded-md bg-ardoise-100 px-1.5 py-0.5 font-mono text-[0.875em] font-medium text-encre-700 dark:bg-ardoise-800 dark:text-encre-300"
            >
              {morceau.slice(1, -1)}
            </code>
          );
        }

        if (morceau.startsWith('**') && morceau.endsWith('**') && morceau.length > 4) {
          return (
            <strong key={i} className="font-semibold">
              {morceau.slice(2, -2)}
            </strong>
          );
        }

        return <span key={i}>{morceau}</span>;
      })}
    </>
  );
}
