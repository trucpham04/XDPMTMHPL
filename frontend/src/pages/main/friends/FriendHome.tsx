import { ChevronDown   } from "lucide-react";
import { useState } from "react";

const friendRequestData=[
    { id: 1, name: "Hưng Thịnh", mutualFriends: 5, avatar: "https://randomuser.me/api/portraits/men/1.jpg" },
    { id: 2, name: "Lê Văn Mẫn", mutualFriends: 3, avatar: "https://randomuser.me/api/portraits/men/2.jpg" },
    { id: 3, name: "Thanh Truyền", mutualFriends: 8, avatar: "https://randomuser.me/api/portraits/women/1.jpg" },
    { id: 4, name: "Lê Văn Mẫn", mutualFriends: 3, avatar: "https://randomuser.me/api/portraits/men/2.jpg" },
    { id: 5, name: "Thanh Truyền", mutualFriends: 8, avatar: "https://randomuser.me/api/portraits/women/1.jpg" },
    { id: 6, name: "Hưng Thịnh", mutualFriends: 5, avatar: "https://randomuser.me/api/portraits/men/1.jpg" },
    { id: 7, name: "Lê Văn Mẫn", mutualFriends: 3, avatar: "https://randomuser.me/api/portraits/men/2.jpg" },
    { id: 8, name: "Thanh Truyền", mutualFriends: 8, avatar: "https://randomuser.me/api/portraits/women/1.jpg" },
    { id: 9, name: "Lê Văn Mẫn", mutualFriends: 3, avatar: "https://randomuser.me/api/portraits/men/2.jpg" },
    { id: 10, name: "Thanh Truyền", mutualFriends: 8, avatar: "https://randomuser.me/api/portraits/women/1.jpg" },
    { id: 11, name: "Thanh Truyền", mutualFriends: 8, avatar: "https://randomuser.me/api/portraits/women/1.jpg" },
    { id: 12, name: "Hưng Thịnh", mutualFriends: 5, avatar: "https://randomuser.me/api/portraits/men/1.jpg" },
    { id: 13, name: "Lê Văn Mẫn", mutualFriends: 3, avatar: "https://randomuser.me/api/portraits/men/2.jpg" },
    { id: 14, name: "Thanh Truyền", mutualFriends: 8, avatar: "https://randomuser.me/api/portraits/women/1.jpg" },
    { id: 15, name: "Lê Văn Mẫn", mutualFriends: 3, avatar: "https://randomuser.me/api/portraits/men/2.jpg" },
    { id: 16, name: "Thanh Truyền", mutualFriends: 8, avatar: "https://randomuser.me/api/portraits/women/1.jpg" },

];

const friendSuggestData=[
    { id: 1, name: "Hưng Thịnh", mutualFriends: 5, avatar: "https://randomuser.me/api/portraits/men/1.jpg" },
    { id: 2, name: "Lê Văn Mẫn", mutualFriends: 3, avatar: "https://randomuser.me/api/portraits/men/2.jpg" },
    { id: 3, name: "Thanh Truyền", mutualFriends: 8, avatar: "https://randomuser.me/api/portraits/women/1.jpg" },
    { id: 4, name: "Lê Văn Mẫn", mutualFriends: 3, avatar: "https://randomuser.me/api/portraits/men/2.jpg" },
    { id: 5, name: "Thanh Truyền", mutualFriends: 8, avatar: "https://randomuser.me/api/portraits/women/1.jpg" },
    { id: 6, name: "Hưng Thịnh", mutualFriends: 5, avatar: "https://randomuser.me/api/portraits/men/1.jpg" },
    { id: 7, name: "Lê Văn Mẫn", mutualFriends: 3, avatar: "https://randomuser.me/api/portraits/men/2.jpg" },
    { id: 8, name: "Thanh Truyền", mutualFriends: 8, avatar: "https://randomuser.me/api/portraits/women/1.jpg" },
    { id: 9, name: "Lê Văn Mẫn", mutualFriends: 3, avatar: "https://randomuser.me/api/portraits/men/2.jpg" },
    { id: 10, name: "Thanh Truyền", mutualFriends: 8, avatar: "https://randomuser.me/api/portraits/women/1.jpg" },
    { id: 11, name: "Thanh Truyền", mutualFriends: 8, avatar: "https://randomuser.me/api/portraits/women/1.jpg" },
    { id: 12, name: "Hưng Thịnh", mutualFriends: 5, avatar: "https://randomuser.me/api/portraits/men/1.jpg" },
    { id: 13, name: "Lê Văn Mẫn", mutualFriends: 3, avatar: "https://randomuser.me/api/portraits/men/2.jpg" },
    { id: 14, name: "Thanh Truyền", mutualFriends: 8, avatar: "https://randomuser.me/api/portraits/women/1.jpg" },
    { id: 15, name: "Lê Văn Mẫn", mutualFriends: 3, avatar: "https://randomuser.me/api/portraits/men/2.jpg" },
    { id: 16, name: "Thanh Truyền", mutualFriends: 8, avatar: "https://randomuser.me/api/portraits/women/1.jpg" },

];



const FriendList: React.FC = ()=>{
    const [visibleCount1, setVisibleCount1] = useState(10); 

    const handleShowMore1 = () => {
        setVisibleCount1((prev) => prev + 10); 
    };

    const [visibleCount2, setVisibleCount2] = useState(10);

    const handleShowMore2 = () => {
        setVisibleCount2((prev) => prev + 10); 
    };

   
    return (
        <div className=" m-8 ">
            <div className="flex">
                <h2 className="text-black text-xl font-bold mb-4">Lời mời kết bạn</h2>
                <a className="text-base ml-auto mr-2 text-blue-500">Xem tất cả</a>
            </div>
            
            <div className="grid grid-cols-5 gap-2">
                {friendRequestData.slice(0,visibleCount1).map((friend) =>
                    <div key={friend.id} className="bg-white rounded-lg text-white overflow-hidden shadow-md">
                    <img src={friend.avatar} alt={friend.name} className="w-full " />
                    <div className="m-2">
                        <p className="text-black font-medium">{friend.name}</p>
                        <p className="text-base text-gray-500">{friend.mutualFriends} Bạn chung</p>
                        <div className="flex flex-col justify-center space-y-2 mt-2 font-bold">
                            <button className="bg-blue-500  py-1.5 rounded-md text-base hover:bg-blue-600">Xác nhận</button>
                            <button className="bg-gray-200  py-1.5 rounded-md text-base text-black hover:bg-gray-300">Xóa</button>
                        </div>
                    </div>
                    
                </div>)}
            </div>
            {visibleCount1 < friendRequestData.length && (
            <div className="flex justify-center mt-2 py-2 hover:bg-gray-200">
                <div className="flex items-center ">
                    <a onClick={handleShowMore1} className="text-base">Xem thêm</a>
                    <ChevronDown className="text-base text-blue-500" />
                </div>
            </div>
            )}
            <hr className="my-4 border-t-2 border-gray-300 font-bold" />

            {/* Bạn có thể quen */}
            <div className="flex">
                <h2 className="text-black text-xl font-bold mb-4">Lời mời kết bạn</h2>
                <a className="text-base ml-auto mr-2 text-blue-500">Xem tất cả</a>
            </div>
            
            <div className="grid grid-cols-5 gap-2">
                {friendSuggestData.slice(0,visibleCount2).map((friend) =>
                    <div key={friend.id} className="bg-white rounded-lg text-white overflow-hidden shadow-md">
                    <img src={friend.avatar} alt={friend.name} className="w-full " />
                    <div className="m-2">
                        <p className="text-black font-medium">{friend.name}</p>
                        <p className="text-base text-gray-500">{friend.mutualFriends} Bạn chung</p>
                        <div className="flex flex-col justify-center space-y-2 mt-2 font-bold">
                            <button className="bg-blue-500  py-1.5 rounded-md text-base hover:bg-blue-600">Xác nhận</button>
                            <button className="bg-gray-200  py-1.5 rounded-md text-base text-black hover:bg-gray-300">Xóa</button>
                        </div>
                    </div>
                    
                </div>)}
            </div>
            {visibleCount2 < friendSuggestData.length && (
            <div className="flex justify-center mt-2 py-2 hover:bg-gray-200">
                <div className="flex items-center ">
                    <a onClick={handleShowMore2} className="text-base">Xem thêm</a>
                    <ChevronDown className="text-base text-blue-500" />
                </div>
            </div>
            )}
           
        </div>
        
    )
        
    
};

export default FriendList;