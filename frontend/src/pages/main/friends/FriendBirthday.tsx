import React from "react";

interface Friend {
  id: number;
  name: string;
  avatar: string;
  birthday: string;
}

const initialBirthdays: Friend[] = [
  { id: 1, name: "Nguyễn Văn A", avatar: "https://randomuser.me/api/portraits/men/1.jpg", birthday: "17/04" },
  { id: 2, name: "Trần Thị B", avatar: "https://randomuser.me/api/portraits/men/1.jpg", birthday: "25/04" },
  { id: 3, name: "Phạm Văn C", avatar: "https://randomuser.me/api/portraits/men/1.jpg", birthday: "30/05" },
  { id: 4, name: "Lê Quyền", avatar: "https://randomuser.me/api/portraits/men/1.jpg", birthday: "10/06" },
  { id: 5, name: "Tây Thi", avatar: "https://randomuser.me/api/portraits/men/1.jpg", birthday: "15/06" },
  { id: 6, name: "Anh Linh", avatar: "https://randomuser.me/api/portraits/men/1.jpg", birthday: "02/05" },
  { id: 7, name: "Trung Hiếu", avatar: "https://randomuser.me/api/portraits/men/1.jpg", birthday: "05/05" },
];

// Hàm nhóm bạn bè theo tháng
const groupByMonth = (friends: Friend[]) => {
  const grouped: { [key: string]: Friend[] } = {};
  friends.forEach((friend) => {
    const month = friend.birthday.split("/")[1]; // Lấy tháng từ ngày sinh
    if (!grouped[month]) {
      grouped[month] = [];
    }
    grouped[month].push(friend);
  });
  return grouped;
};

const FriendBirthday: React.FC = () => {
  const groupedFriends = groupByMonth(initialBirthdays);
  const monthNames: { [key: string]: string } = {
    "01": "Tháng 1",
    "02": "Tháng 2",
    "03": "Tháng 3",
    "04": "Tháng 4",
    "05": "Tháng 5",
    "06": "Tháng 6",
    "07": "Tháng 7",
    "08": "Tháng 8",
    "09": "Tháng 9",
    "10": "Tháng 10",
    "11": "Tháng 11",
    "12": "Tháng 12",
  };

  return (
    <div className="mt-5 max-w-xl  mx-auto">
      {Object.keys(groupedFriends)
        .sort()
        .map((month) => {
          const friends = groupedFriends[month];
          return (
            <div key={month} className="mb-4 p-4 w-lg bg-white shadow-md rounded-lg">
              <h2 className="text-lg font-semibold mb-2">{monthNames[month]}</h2>
              <p className="font-medium">
                {friends.slice(0, 2).map((f) => f.name).join(", ")}{" "}
                {friends.length > 2 && `và ${friends.length - 2} người khác`}
              </p>
              <div className="flex mt-2">
                {friends.map((friend) => (
                  <img
                    key={friend.id}
                    src={friend.avatar}
                    alt={friend.name}
                    className="w-13 h-13 rounded-full border border-gray-300 mr-3 first:ml-0"
                  />
                ))}
              </div>
            </div>
          );
        })}
    </div>
  );
};

export default FriendBirthday;
