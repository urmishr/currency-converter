import { useEffect, useState } from "react";
import "./App.css";

export default function App() {
    const [value, setValue] = useState(1);
    const [fromCurrency, setFromCurrency] = useState("1");
    const [toCurrency, setToCurrency] = useState("1");
    const [converted, setConverted] = useState(0);
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const validValue = !error && converted > 0 && fromCurrency !== toCurrency;

    useEffect(
        function () {
            if (fromCurrency === "1" || toCurrency === "1" || fromCurrency === toCurrency) {
                setConverted(0); // Optionally reset the converted value
                setError(""); // Optionally reset the error message
                return; // Exit early
            }
            async function convert() {
                try {
                    setError("");
                    setIsLoading(true);
                    const res = await fetch(
                        `https://api.frankfurter.app/latest?amount=${value}&from=${fromCurrency}&to=${toCurrency}`
                    );
                    if (!res.ok) throw new Error("Error converting values");
                    const data = await res.json();

                    setConverted(data.rates[toCurrency]);
                    setIsLoading(false);
                } catch (e) {
                    console.error(e.message);
                    setError(e.message);
                } finally {
                    setIsLoading(false);
                }
            }

            convert();
        },
        [value, toCurrency, fromCurrency]
    );

    return (
        <div className="container p-2">
            <h1 className="text-center mt-2 text-primary"> Currency converter </h1>
            <hr />
            <div className="row border m-2 p-3 rounded">
                <div className="col-auto">
                    <input
                        className="form-control "
                        type="text"
                        value={value}
                        onChange={(e) => setValue(Number(e.target.value))}
                        placeholder="Currency to convert..."
                        aria-label="currency converter"
                    />
                </div>
                <div className="col-auto">
                    <select
                        className="form-select"
                        value={fromCurrency}
                        onChange={(e) => setFromCurrency(e.target.value)}
                    >
                        <option value={"1"}>From</option>
                        <option value={"EUR"}>EUR</option>
                        <option value={"USD"}>USD</option>
                        <option value={"INR"}>INR</option>
                        <option value={"CAD"}>CAD</option>
                    </select>
                </div>

                <div className="col-auto">
                    <select
                        className="form-select"
                        value={toCurrency}
                        onChange={(e) => setToCurrency(e.target.value)}
                    >
                        <option value={"1"}>To</option>
                        <option value={"EUR"}>EUR</option>
                        <option value={"USD"}>USD</option>
                        <option value={"INR"}>INR</option>
                        <option value={"CAD"}>CAD</option>
                    </select>
                </div>
                {isLoading && <Loader />}
            </div>
            <div className="m-2">
                {/* {isLoading && <p className="text-secondary">Loading...</p>} */}
                {validValue && !isLoading && (
                    <p className="text-primary">
                        {value} {fromCurrency} is <strong>{converted}</strong> {toCurrency}
                    </p>
                )}
                {!validValue && !isLoading && (
                    <p className="text-warning">please select proper values!</p>
                )}
                {error && <p className="text-danger">{error}</p>}
            </div>
        </div>
    );
}

function Loader() {
    return <div className="loader"></div>;
}
