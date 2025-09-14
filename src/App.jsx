import { useState, useEffect } from 'react'

export default function App() {
    const [statTracker, setStatTracker] = useState({ items: [] });
    const [newItem, setNewItem] = useState('');
    const [countType, setCountType] = useState('manual');
    const [startDate, setStartDate] = useState(new Date());
    const [freqNum, setFreqNum] = useState(1); // in hours

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
                    // add startDate and freqNum if type is frequency
                    ...(countType === "frequency" && { startDate: startDate, freqNum: freqNum }) 
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
            const freq = parseInt(item.freqNum, 10);    // frequency in hours
            const occurrences = Math.floor(hoursPassed / freq); 
            return occurrences + item.count;
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
                    className="flex rounded-lg bg-red-500 text-white px-6 py-3 font-semibold 
                    hover:bg-red-600 transition-colors duration-300 float-right hover:cursor-pointer"
                    >Delete All
                    <img className="ml-2 w-5" src="trash-bin-minimalistic-2.svg" alt="empty all trash" />
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
                        <label className="text-black" htmlFor="freqNum">Number:</label>
                        <select id="freqNum" value={freqNum} onChange={(event) => {setFreqNum(event.target.value)}} className="border-gray-400 border-1 rounded-sm">
                            <option value="1">1 hour</option>
                            <option value="24">1 day</option>
                            <option value="168">1 week</option>
                            <option value="720">1 month</option>
                            <option value="8760">1 year</option>
                        </select>

                    </div>
                )}

                <p className="text-2xl font-bold">{(statTracker.items || []).length} Total items</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                    {statTracker.items?.map((item, index) => (
                        <div key={(statTracker.items || []).indexOf(item)} 
                        className="flex justify-between overflow-auto bg-amber-200 p-4 rounded-lg shadow-md">
                            <button 
                                className="px-6 py-2 rounded-xl transition-colors duration-300 bg-green-500 hover:cursor-pointer hover:bg-green-600 text-2xl text-white"
                                onClick={() => {statTracker.items[index].count += 1; 
                                    setStatTracker({...statTracker}); localStorage.setItem('statTracker', JSON.stringify(statTracker));}}
                            >+</button>

                            <h1 className='text-2xl font-semibold text-gray-800 mx-4 my-auto'>
                                {(item.name.length > 10 ? item.name.substring(0, 10) + '...' : item.name)
                                + ' : ' + calculateItemCount(item)}
                            </h1>
                            
                            <button className="h-fit text-black w-fit hover:cursor-pointer
                            transition-colors duration-300 float-right"
                            onClick={() => handleRemoveItem(index)}>
                                <img className="w-8" src="trash-bin-minimalistic.svg" alt="trash" />
                            </button>
                            
                        </div>
                    ))}
                </div>

            </div>
        </div>
    )
}