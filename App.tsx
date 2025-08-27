
import React, { useState, useCallback } from 'react';
import CalculatorButton from './components/CalculatorButton';
import './types'; // Import to ensure TypeScript sees the global declaration

const App: React.FC = () => {
  const [display, setDisplay] = useState<string>('0');
  const [isRadians, setIsRadians] = useState<boolean>(true);
  const [memory, setMemory] = useState<number>(0);
  const [isResultShown, setIsResultShown] = useState<boolean>(false);

  const handleButtonClick = useCallback((value: string) => {
    if (display === 'Error') {
      setDisplay('0');
      if (value !== 'AC') return;
    }

    // If a result is shown, and user types a number, start a new calculation
    if (isResultShown && '0123456789.('.includes(value)) {
      setDisplay(value === '.' ? '0.' : value);
      setIsResultShown(false);
      return;
    }
    
    setIsResultShown(false);

    switch (value) {
      case 'AC':
        setDisplay('0');
        break;
      case 'C': // Backspace
        setDisplay(d => d.length > 1 ? d.slice(0, -1) : '0');
        break;
      case 'DEG/RAD':
        setIsRadians(r => !r);
        break;
      case '=':
        try {
          let expr = display
            .replace(/π/g, 'pi')
            .replace(/√/g, 'sqrt')
            .replace(/log/g, 'log10');

          if (!isRadians) {
            expr = expr.replace(/(sin|cos|tan)\(/g, (match) => `${match.slice(0, -1)}(${Math.PI / 180} * `);
          }
          
          const result = math.evaluate(expr);
          // Format result to a reasonable precision
          const formattedResult = parseFloat(result.toPrecision(15));
          setDisplay(formattedResult.toString());
          setIsResultShown(true);
        } catch (error) {
          setDisplay('Error');
        }
        break;
      case '±':
        setDisplay(d => {
          if (d === '0' || d === 'Error') return '0';
          if (d.startsWith('-')) return d.substring(1);
          return `-${d}`;
        });
        break;
      case 'M+':
        try {
          const currentValue = math.evaluate(display);
          setMemory(m => m + currentValue);
        } catch {}
        break;
      case 'M-':
         try {
          const currentValue = math.evaluate(display);
          setMemory(m => m - currentValue);
        } catch {}
        break;
      case 'MR':
        setDisplay(d => (d === '0' ? '' : d) + memory.toString());
        break;
      case 'MC':
        setMemory(0);
        break;
      case '.':
        // Avoid multiple dots in a number
        const parts = display.split(/[\+\-\*\/]/);
        if (!parts[parts.length - 1].includes('.')) {
          setDisplay(d => d + '.');
        }
        break;
      default:
        // Handle function buttons
        if (['sin', 'cos', 'tan', '√', 'log', 'ln'].includes(value)) {
            setDisplay(d => (d === '0' ? value + '(' : d + value + '('));
        } else {
            setDisplay(d => (d === '0' ? value : d + value));
        }
        break;
    }
  }, [display, isRadians, memory, isResultShown]);

  const buttonClass = "text-white";
  const numClass = `${buttonClass} bg-gray-600 hover:bg-gray-500`;
  const opClass = `${buttonClass} bg-orange-500 hover:bg-orange-600`;
  const funcClass = `${buttonClass} bg-gray-700 hover:bg-gray-800`;

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-2 sm:p-4">
      <div className="w-full max-w-sm mx-auto bg-gray-800 rounded-2xl shadow-lg p-4 space-y-4">
        {/* Display */}
        <div className="bg-gray-900 rounded-lg p-4 text-right break-words">
          <div className="text-gray-400 text-sm font-mono h-6 flex justify-between">
            <span>{isRadians ? 'RAD' : 'DEG'}</span>
            {memory !== 0 && <span className="px-2 py-0.5 bg-green-700 text-white rounded-md text-xs">M</span>}
          </div>
          <div className="text-white font-sans text-5xl h-16 flex items-end justify-end">
             {display}
          </div>
        </div>

        {/* Buttons */}
        <div className="grid grid-cols-5 gap-2">
          <CalculatorButton onClick={handleButtonClick} value="DEG/RAD" label={isRadians ? 'RAD' : 'DEG'} ariaLabel="Cambiar entre radianes y grados" className={funcClass} />
          <CalculatorButton onClick={handleButtonClick} value="sin" ariaLabel="seno" className={funcClass} />
          <CalculatorButton onClick={handleButtonClick} value="cos" ariaLabel="coseno" className={funcClass} />
          <CalculatorButton onClick={handleButtonClick} value="tan" ariaLabel="tangente" className={funcClass} />
          <CalculatorButton onClick={handleButtonClick} value="C" label="⌫" ariaLabel="borrar último caracter" className={funcClass} />

          <CalculatorButton onClick={handleButtonClick} value="ln" ariaLabel="logaritmo natural" className={funcClass} />
          <CalculatorButton onClick={handleButtonClick} value="log" ariaLabel="logaritmo base 10" className={funcClass} />
          <CalculatorButton onClick={handleButtonClick} value="√" label="√x" ariaLabel="raíz cuadrada" className={funcClass} />
          <CalculatorButton onClick={handleButtonClick} value="^" label="xʸ" ariaLabel="potencia" className={funcClass} />
          <CalculatorButton onClick={handleButtonClick} value="AC" ariaLabel="borrar todo" className={`${buttonClass} bg-red-600 hover:bg-red-700`} />

          <CalculatorButton onClick={handleButtonClick} value="(" ariaLabel="abrir paréntesis" className={funcClass} />
          <CalculatorButton onClick={handleButtonClick} value=")" ariaLabel="cerrar paréntesis" className={funcClass} />
          <CalculatorButton onClick={handleButtonClick} value="!" label="n!" ariaLabel="factorial" className={funcClass} />
          <CalculatorButton onClick={handleButtonClick} value="π" ariaLabel="pi" className={funcClass} />
          <CalculatorButton onClick={handleButtonClick} value="±" ariaLabel="cambiar signo" className={funcClass} />
          
          <CalculatorButton onClick={handleButtonClick} value="7" ariaLabel="siete" className={numClass} />
          <CalculatorButton onClick={handleButtonClick} value="8" ariaLabel="ocho" className={numClass} />
          <CalculatorButton onClick={handleButtonClick} value="9" ariaLabel="nueve" className={numClass} />
          <CalculatorButton onClick={handleButtonClick} value="/" label="÷" ariaLabel="dividir" className={opClass} />
          <CalculatorButton onClick={handleButtonClick} value="M+" ariaLabel="sumar a memoria" className={funcClass} />

          <CalculatorButton onClick={handleButtonClick} value="4" ariaLabel="cuatro" className={numClass} />
          <CalculatorButton onClick={handleButtonClick} value="5" ariaLabel="cinco" className={numClass} />
          <CalculatorButton onClick={handleButtonClick} value="6" ariaLabel="seis" className={numClass} />
          <CalculatorButton onClick={handleButtonClick} value="*" label="×" ariaLabel="multiplicar" className={opClass} />
          <CalculatorButton onClick={handleButtonClick} value="M-" ariaLabel="restar de memoria" className={funcClass} />

          <CalculatorButton onClick={handleButtonClick} value="1" ariaLabel="uno" className={numClass} />
          <CalculatorButton onClick={handleButtonClick} value="2" ariaLabel="dos" className={numClass} />
          <CalculatorButton onClick={handleButtonClick} value="3" ariaLabel="tres" className={numClass} />
          <CalculatorButton onClick={handleButtonClick} value="-" label="−" ariaLabel="restar" className={opClass} />
          <CalculatorButton onClick={handleButtonClick} value="MR" ariaLabel="recuperar de memoria" className={funcClass} />

          <CalculatorButton onClick={handleButtonClick} value="0" ariaLabel="cero" className={numClass} />
          <CalculatorButton onClick={handleButtonClick} value="." ariaLabel="punto decimal" className={numClass} />
          <CalculatorButton onClick={handleButtonClick} value="MC" ariaLabel="limpiar memoria" className={funcClass} />
          <CalculatorButton onClick={handleButtonClick} value="+" label="+" ariaLabel="sumar" className={opClass} />
          <CalculatorButton onClick={handleButtonClick} value="=" ariaLabel="igual" className={`${buttonClass} bg-blue-600 hover:bg-blue-700`} />
        </div>
      </div>
    </div>
  );
};

export default App;
