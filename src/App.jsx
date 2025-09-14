import { useState, useEffect } from 'react'

export default function App() {
    const [statTracker, setStatTracker] = useState({ items: [] });
    const [newItem, setNewItem] = useState('');

    useEffect(() => {
        const storedStats = localStorage.getItem('statTracker');
        if (storedStats) {
            setStatTracker(JSON.parse(storedStats));
        }
    }, []);

    const handleAddItem = () => {
        if (newItem.trim() === '') return;

        const updatedTracker = {
            ...statTracker, items: [...(statTracker.items || []), { name: newItem , count: 0}],
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
                        className="rounded-lg bg-blue-500 text-white px-6 py-3 font-semibold hover:bg-blue-600 transition-colors duration-300"
                    >Add Item
                    </button>
                    
                    <button onClick={handleClearAll}
                    className="rounded-lg bg-red-500 text-white px-6 py-3 font-semibold 
                    hover:bg-red-600 transition-colors duration-300 float-right"
                    >Delete All</button>
                </div>

                <p className="text-2xl font-bold">{(statTracker.items || []).length} Total items</p>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
                    {statTracker.items?.map((item, index) => (
                        <div key={(statTracker.items || []).indexOf(item)} 
                        className="flex justify-between overflow-auto bg-amber-200 p-4 rounded-lg shadow-md">
                            <button 
                                className="px-6 py-2 rounded-xl transition-colors duration-300 bg-gray-300"
                                onClick={() => {statTracker.items[index].count += 1; 
                                    setStatTracker({...statTracker}); localStorage.setItem('statTracker', JSON.stringify(statTracker));}}
                            >+</button>

                            {item.name +' : '+ item.count}
                            
                            <button className="h-fit bg-red-500 text-black w-fit hover:bg-red-600 
                            transition-colors duration-300 float-right"
                            onClick={() => handleRemoveItem(index)}>X</button>
                            
                        </div>
                    ))}
                </div>

            </div>
        </div>
    )
}