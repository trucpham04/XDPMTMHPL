import React, { useState } from "react";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface FriendGroup {
  id: number;
  name: string;
  members: string[];
}

const initialGroups: FriendGroup[] = [
  { id: 1, name: "Bạn thân", members: ["Nguyễn Văn A", "Trần Thị B"] },
  { id: 2, name: "Đồng nghiệp", members: ["Phạm Văn C", "Lê Thị D"] },
];

const FriendCustomList: React.FC = () => {
  const [groups, setGroups] = useState<FriendGroup[]>(initialGroups);
  const [newGroupName, setNewGroupName] = useState("");

  const handleAddGroup = () => {
    if (newGroupName.trim() === "") return;
    setGroups([...groups, { id: groups.length + 1, name: newGroupName, members: [] }]);
    setNewGroupName("");
  };

  const navigate = useNavigate();


  return (
    <div className="w-full bg-white shadow-sm h-screen">
      <div className="p-2">
        <button onClick={() => navigate("/friends")} className="p-2">
          <ArrowLeft size={24} className="text-gray-500 cursor-pointer" />
        </button>
        <h2 className="text-xl font-semibold mb-4">Danh sách nhóm bạn bè</h2>

      <div className="flex gap-2 mb-4">
        <input
          type="text"
          placeholder="Tên nhóm mới"
          value={newGroupName}
          onChange={(e) => setNewGroupName(e.target.value)}
          className="border p-2 flex-1 rounded-md"
        />
        <button
          onClick={handleAddGroup}
          className="bg-blue-500 text-white px-3 py-2 rounded-md hover:bg-blue-600"
        >
          Thêm nhóm
        </button>
      </div>

      <ul>
        {groups.map((group) => (
          <li key={group.id} className="border-b p-3">
            <h3 className="font-semibold">{group.name}</h3>
            <p className="text-sm text-gray-500">
              Thành viên: {group.members.length > 0 ? group.members.join(", ") : "Chưa có"}
            </p>
          </li>
        ))}
      </ul>
      </div>
      
    </div>
  );
};

export default FriendCustomList;
