import { useState, useEffect } from 'react'

function App() {
    const [statTracker, setStatTracker] = useState({ items: [] });
    const [newItem, setNewItem] = useState('');
    const [editingIndex, setEditingIndex] = useState(null);
    const [editingText, setEditingText] = useState('');

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
            items: [...(statTracker.items || []), { name: newItem , count: 0}],
        };

        setStatTracker(updatedTracker);
        localStorage.setItem('statTracker', JSON.stringify(updatedTracker));
        setNewItem('');
    };

    const handleClearAll = () => {
        setStatTracker({ items: [] });
        localStorage.removeItem('statTracker');
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
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4 items-center">
                    <input
                        type="text"
                        value={newItem}
                        onChange={(e) => setNewItem(e.target.value)}
                        placeholder="Enter a new item"
                        className="p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <div className="flex gap-2">
                        <button onClick={handleAddItem}
                            className="flex-grow rounded-lg bg-blue-500 text-white px-6 py-3 font-semibold hover:bg-blue-600 transition-colors duration-300"
                        >
                            Add Item
                        </button>
                        <button onClick={handleClearAll}
                            className="flex-grow rounded-lg bg-red-500 text-white px-6 py-3 font-semibold hover:bg-red-600 transition-colors duration-300"
                        >
                            Clear All
                        </button>
                    </div>
                    <p className="text-2xl font-bold">{(statTracker.items || []).length} Total items</p>
                </div>

                <div className="space-y-4">
                    {statTracker.items?.map((item, index) => (
                        <button key={(statTracker.items || []).indexOf(item)}
                            className="p-4 rounded-lg transition-colors duration-300 bg-white">
                            {item.name}{item.count}
                        </button>
                    ))}
                </div>

            </div>
        </div>
    )
}

export default App
