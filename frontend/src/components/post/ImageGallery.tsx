import React from "react";

interface MultiFile {
    url: string;  
    type: "image" | "video"; 
}

interface ImageGalleryProps {
    multiFiles: MultiFile[];  
    postIndex: number;
    onImageClick: (postIndex: number, imageIndex: number) => void;
}

export const ImageGallery: React.FC<ImageGalleryProps> = ({ multiFiles, postIndex, onImageClick }) => {
    // Hàm kiểm tra nếu file là video
    const isVideo = (file: MultiFile) => {
        return file.type === "video"; 
    };

    return (
        <div className="w-full max-w-[500px] flex flex-wrap justify-center gap-1">
            {multiFiles.length === 1 && (
                <div className="w-full h-[380px]">
                    {isVideo(multiFiles[0]) ? (
                        <video
                            src={multiFiles[0].url}
                            className="w-full h-full object-cover rounded"
                            onClick={() => onImageClick(postIndex, 0)}
                            controls
                        >
                            Your browser does not support the video tag.
                        </video>
                    ) : (
                        <img
                            src={multiFiles[0].url}
                            alt="Post image"
                            className="w-full h-full object-cover rounded"
                            onClick={() => onImageClick(postIndex, 0)}
                        />
                    )}
                </div>
            )}

            {multiFiles.length === 2 && (
                <div className="w-full flex gap-0.5">
                    {multiFiles.map((file, idx) => (
                        <div key={idx} className="w-1/2 h-[380px]">
                            {isVideo(file) ? (
                                <video
                                    src={file.url}
                                    className="w-full h-full object-cover rounded"
                                    onClick={() => onImageClick(postIndex, idx)}
                                    controls
                                >
                                    Your browser does not support the video tag.
                                </video>
                            ) : (
                                <img
                                    src={file.url}
                                    alt={`Post image ${idx + 1}`}
                                    className="w-full h-full object-cover rounded"
                                    onClick={() => onImageClick(postIndex, idx)}
                                />
                            )}
                        </div>
                    ))}
                </div>
            )}

            {multiFiles.length === 3 && (
                <div className="w-full flex gap-0.5">
                    <div className="w-1/2 h-[380px] flex flex-col gap-0.5">
                        {multiFiles.slice(0, 2).map((file, idx) => (
                            <div key={idx} className="w-full h-[190px]">
                                {isVideo(file) ? (
                                    <video
                                        src={file.url}
                                        className="w-full h-full object-cover rounded"
                                        onClick={() => onImageClick(postIndex, idx)}
                                        controls
                                    >
                                        Your browser does not support the video tag.
                                    </video>
                                ) : (
                                    <img
                                        src={file.url}
                                        alt={`Post image ${idx + 1}`}
                                        className="w-full h-full object-cover rounded"
                                        onClick={() => onImageClick(postIndex, idx)}
                                    />
                                )}
                            </div>
                        ))}
                    </div>
                    <div className="w-1/2 h-[380px]">
                        {isVideo(multiFiles[2]) ? (
                            <video
                                src={multiFiles[2].url}
                                className="w-full h-full object-cover rounded"
                                onClick={() => onImageClick(postIndex, 2)}
                                controls
                            >
                                Your browser does not support the video tag.
                            </video>
                        ) : (
                            <img
                                src={multiFiles[2].url}
                                alt="Post image"
                                className="w-full h-full object-cover rounded"
                                onClick={() => onImageClick(postIndex, 2)}
                            />
                        )}
                    </div>
                </div>
            )}

            {multiFiles.length === 4 && (
                <div className="w-full flex flex-wrap gap-0.5">
                    {multiFiles.slice(0, 4).map((file, idx) => (
                        <div key={idx} className="w-[249px] h-[190px]">
                            {isVideo(file) ? (
                                <video
                                    src={file.url}
                                    className="w-full h-full object-cover rounded"
                                    onClick={() => onImageClick(postIndex, idx)}
                                    controls
                                >
                                    Your browser does not support the video tag.
                                </video>
                            ) : (
                                <img
                                    src={file.url}
                                    alt={`Post image ${idx + 1}`}
                                    className="w-full h-full object-cover rounded"
                                    onClick={() => onImageClick(postIndex, idx)}
                                />
                            )}
                        </div>
                    ))}
                </div>
            )}

            {multiFiles.length > 4 && (
                <div className="w-full flex flex-wrap gap-0.5 relative">
                    {multiFiles.slice(0, 3).map((file, idx) => (
                        <div key={idx} className="w-[249px] h-[190px]">
                            {isVideo(file) ? (
                                <video
                                    src={file.url}
                                    className="w-full h-full object-cover rounded"
                                    onClick={() => onImageClick(postIndex, idx)}
                                    controls
                                >
                                    Your browser does not support the video tag.
                                </video>
                            ) : (
                                <img
                                    src={file.url}
                                    alt={`Post image ${idx + 1}`}
                                    className="w-full h-full object-cover rounded"
                                    onClick={() => onImageClick(postIndex, idx)}
                                />
                            )}
                        </div>
                    ))}
                    <div key={4} className="w-[249px] h-[190px] relative">
                        {isVideo(multiFiles[3]) ? (
                            <video
                                src={multiFiles[3].url}
                                className="w-full h-full object-cover rounded opacity-70"
                                onClick={() => onImageClick(postIndex, 3)}
                                controls
                            >
                                Your browser does not support the video tag.
                            </video>
                        ) : (
                            <img
                                src={multiFiles[3].url}
                                alt="Post image"
                                className="w-full h-full object-cover rounded opacity-70"
                                onClick={() => onImageClick(postIndex, 3)}
                            />
                        )}
                        <div className="absolute inset-0 flex items-center justify-center bg-transparent opacity-50 text-black text-[25px] font-bold pointer-events-none">
                            + {multiFiles.length - 4}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
