import { useState, useEffect } from 'react'

export default function App() {
    const [statTracker, setStatTracker] = useState({ items: [] });
    const [newItem, setNewItem] = useState('');
    const [countType, setCountType] = useState('manual');
    const [startDate, setStartDate] = useState(new Date());
    const [frequency, setfrequency] = useState(1); // in hours
    const [frequencyCount, setFrequencyCount] = useState(1);

    useEffect(() => {
        const storedStats = localStorage.getItem('statTracker');
        if (storedStats) {
            setStatTracker(JSON.parse(storedStats));
        }

    }, []);

    const handleAddItem = () => {
        if (newItem.trim() === '') return;

        const updatedTracker = {
            ...statTracker,
            items: [
                ...(statTracker.items || []),
                {
                    name: newItem,
                    count: 0,
                    type: countType,
                    // add startDate and frequency if type is frequency
                    ...(countType === "frequency" && { startDate: startDate, frequency: frequency, frequencyCount: frequencyCount }) 
                }
            ],
        };

        setStatTracker(updatedTracker);
        localStorage.setItem('statTracker', JSON.stringify(updatedTracker));
        setNewItem('');
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            handleAddItem();
        }
    };

    const handleClearAll = () => {
        if (window.confirm('Are you sure you want to delete all items? This action cannot be undone.')) {
            setStatTracker({ items: [] });
            localStorage.removeItem('statTracker');
        }
    };


    const handleRemoveItem = (index) => {
        // get all the items that we dont want to delete
        const newItems = (statTracker.items || []).filter((_, i) => i !== index);
        const updatedTracker = { ...statTracker, items: newItems };

        setStatTracker(updatedTracker);
        localStorage.setItem('statTracker', JSON.stringify(updatedTracker));
    };

    function calculateItemCount(item) {
        if (item.type === "manual") {
            return item.count;
        } else if (item.type === "frequency") {
            const now = new Date();
            const start = new Date(item.startDate);
            const hoursPassed = Math.floor((now - start) / (1000 * 60 * 60)); // convert from milliseconds to hours
            const freq = parseInt(item.frequency, 10);    // frequency in hours
            const occurrences = Math.floor(hoursPassed / freq); 
            return occurrences*item.frequencyCount + item.count;
        }
        return item.count; // default case
    }

    
    return (
        <div className="container mx-auto p-8 bg-white rounded-lg shadow-lg max-w-4xl">
            <h1 className="text-4xl font-bold text-center text-gray-800 mb-2">Stat Tracker</h1>
            <p className="text-center text-gray-600 mb-8">
                Personal item bucketlist tracking website app.
            </p>
            <div className="bg-gray-50 p-6 rounded-lg">
                <div className="gap-4 ">
                    <input type="text" maxLength="15" value={newItem}
                        onChange={(e) => setNewItem(e.target.value)} onKeyDown={handleKeyDown}
                        placeholder="Enter a new item"
                        className="p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    
                    
                    <button onClick={handleAddItem}
                        className="rounded-lg bg-blue-500 text-white px-6 py-3 font-semibold hover:bg-blue-600 
                        transition-colors duration-300 hover:cursor-pointer ml-4"
                    >Add Item
                    </button>

                    
                    <button onClick={handleClearAll}
                    className="flex items-center rounded-lg bg-red-500 text-white px-6 py-3 font-semibold 
                    hover:bg-red-600 transition-colors duration-300 float-right hover:cursor-pointer"
                    >Delete All
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" 
                        className="ml-2 w-8 stroke-1 stroke-black">
                            <path stroke-linecap="round" stroke-linejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                        </svg>

                    </button>

                </div>
                <div className="flex justify-start w-full m-4 gap-4">
                    <input type="radio" name="type" id="type1" defaultChecked onClick={() => setCountType("manual")}
                    className="hover:cursor-pointer"></input>
                    <label htmlFor="type1" className="hover:cursor-pointer">Manual</label>

                    <input type="radio" name="type" id="type2" onClick={() => setCountType("frequency")}
                    className="hover:cursor-pointer"></input>
                    <label htmlFor="type2" className="hover:cursor-pointer">Frequency</label>

                </div>

                {countType === "frequency" && (
                    
                    <div className="flex justify-start w-full m-4 gap-4">
                        <label className="text-black" htmlFor="startDate">Start Date:</label>
                        <input type="date" id="startDate" className="border-gray-400 border-1 rounded-sm"
                        max={new Date().toISOString().split("T")[0]} value={startDate.toISOString().split("T")[0]}
                        onChange={(event) => {setStartDate(event.target.valueAsDate)}}></input>
                        <label className="text-black" htmlFor="frequency">Frequency:</label>
                        <select id="frequency" value={frequency} onChange={(event) => {setfrequency(event.target.value)}} className="border-gray-400 border-1 rounded-sm">
                            <option value="1">1 hour</option>
                            <option value="24">1 day</option>
                            <option value="168">1 week</option>
                            <option value="720">1 month</option>
                            <option value="8760">1 year</option>
                        </select>
                        <label className="text-black" htmlFor="frequencyCount">Count:</label>
                        <input type="number" id="frequencyCount" value={frequencyCount}
                            onChange={(event) => {setFrequencyCount(event.target.value)}} 
                            className="border-gray-400 border-1 rounded-sm w-16">
                        </input>

                    </div>
                )}

                <p className="text-2xl font-bold">{(statTracker.items || []).length} Total items</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                    {statTracker.items?.map((item, index) => (
                        <div key={(statTracker.items || []).indexOf(item)} 
                        className="flex justify-between items-center overflow-auto bg-gray-200 p-4 rounded-lg shadow-md">
                            <button className="px-6 py-2 rounded-xl transition-colors duration-300 bg-gray-300 
                            hover:cursor-pointer hover:bg-gray-400"
                            onClick={() => {statTracker.items[index].count += 1; 
                                setStatTracker({...statTracker}); localStorage.setItem('statTracker', JSON.stringify(statTracker));}}>
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                                className="w-8 stroke-1 stroke-black">
                                    <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                                </svg>

                            </button>

                            <h1 className='text-2xl font-semibold text-gray-800 mx-4 my-auto'>
                                {(item.name.length > 10 ? item.name.substring(0, 10) + '...' : item.name)
                                + ' : ' + calculateItemCount(item)}
                            </h1>
                            
                            <button className="text-black w-fit hover:cursor-pointer
                            transition-colors duration-300 float-right"
                            onClick={() => handleRemoveItem(index)}>
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                                className="w-8 stroke-1 stroke-black">
                                    <path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" />
                                </svg>

                            </button>
                            
                        </div>
                    ))}
                </div>

            </div>
        </div>
    )
}