"use client";
import React, { useContext, useEffect, useRef, useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { AiFillPicture } from "react-icons/ai";
import { IoMdAdd } from "react-icons/io";
import { RxAvatar } from "react-icons/rx";
import { FaPencilAlt, FaTrashAlt } from "react-icons/fa";
import { SocketContext } from "@/provider/context";
import { getProfileData } from "../actions/getProfile";
import UpdateProfileImage from "../actions/updateProfileImage";
import deleteProfileImage from "../actions/DeleteProfileImage";
import UpdatePictureImage from "../actions/UpdatePicture";
import deletePictureImage from "../actions/DeletePictureImage";
import UpdatePicturesImage from "../actions/UpdatePictures";
import UpdateUserProfileText from "../actions/UpdateUserProfileText";
import CreateCheckOut from "../actions/CreateCheckout";

export default function Profile() {
  const generateAges = () => {
    const ages = [];
    for (let age = 18; age <= 80; age++) {
      ages.push(age);
    }
    return ages;
  };

  const ages = generateAges();

  const {
    data: profile,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["profile"],
    queryFn: () => getProfileData(),
  });
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [email, setEmail] = useState("");
  const [credits, setCredits] = useState(0);
  const [profile1, setProfile1] = useState(null);
  const [pictures, setPictures] = useState([]);
  const [hovered, setHovered] = useState(false);
  const [isUpdateDisabled, setIsUpdateDisabled] = useState(false);
  const [hoveredIndexes, setHoveredIndexes] = useState([]);
  const router = useRouter();
  const { socket } = useContext(SocketContext);
  const inputRef = useRef();
  const inputRef1 = useRef();
  const addPicturesRef = useRef();
  useEffect(() => {
    if (socket) {
      socket.on("deduct", (message) => {
        setCredits(message);
      });
    }
  }, [socket]);

  useEffect(() => {
    if (profile) {
      setName(profile?.name || "");
      setAge(profile?.age || "");
      setEmail(profile?.email || "");
      setCredits(profile?.credits || 0);
      setProfile1(profile?.ProfilePic || null);
      setPictures(
        profile?.Picture.map((pic: any, index: any) => ({
          PicturePic: pic,
          PicturePicPublic: profile.PicturePublic[index],
        })) || []
      );
    }
  }, [profile]);

  const { mutateAsync: updateProfileImage } = useMutation({
    mutationFn: UpdateProfileImage,
  });
  const { mutateAsync: deleteProfileImageMutation } = useMutation({
    mutationFn: deleteProfileImage,
  });
  const { mutateAsync: uploadPic } = useMutation({
    mutationFn: UpdatePicturesImage,
  });
  const { mutateAsync: updateUserProfile, isPending } = useMutation({
    mutationFn: UpdateUserProfileText,
  });

  const handleMouseEnter = () => {
    setHovered(true);
  };

  const handleMouseLeave = () => {
    setHovered(false);
  };

  const handleProfilePicClick = () => {};

  const handlePictureMouseEnter = (index) => {
    setHoveredIndexes((prev) => [...prev, index]);
  };

  const handlePictureMouseLeave = (index) => {
    setHoveredIndexes((prev) => prev.filter((i) => i !== index));
  };
  const { mutateAsync: deletePic } = useMutation({
    mutationFn: deletePictureImage,
  });
  const { mutateAsync: createCheckout, isPending: checkoutPending } =
    useMutation({
      mutationFn: CreateCheckOut,
      onSuccess: () => {
        console.log("success");
      },
    });
  const checkOutPage = async () => {
    try {
      const data = await createCheckout();
      if (data && data.url) {
        router.push(data.url);
      }
    } catch (error) {
      console.log(error);
    }
  };
  const handleDeletePictureImage = async (index: any) => {
    try {
      await deletePic({ userId: profile.id, imageIndex: index });
      const updatedPictures = pictures.filter((_, i) => i !== index);
      setPictures(updatedPictures);
    } catch (error) {
      console.error("Error deleting picture:", error);
    }
  };
  const handleOnChoose = () => {
    inputRef.current.click();
  };

  const handleOnChange = async (event: any) => {
    const file = event.target.files[0];
    if (file) {
      const formData = new FormData();
      formData.append("ProfilePic", file);
      formData.append("oldProfilePicPublic", profile.ProfilePicPublic);

      try {
        await updateProfileImage({ formData, userId: profile.id });
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = (e) => setProfile1(e.target.result);
      } catch (error) {
        console.error("Error uploading profile picture:", error);
      }
    }
  };

  const handleDeleteProfileImage = async () => {
    try {
      await deleteProfileImageMutation(profile.id);
      setProfile1(null);
    } catch (error) {
      console.error("Error deleting profile picture:", error);
    }
  };
  const handleOnChoosePicture = (index: any) => {
    inputRef1.current.setAttribute("data-index", index);
    inputRef1.current.click();
  };
  const handleOnChangePicture = async (event: any) => {
    const file = event.target.files[0];
    const imageIndex = inputRef1.current.getAttribute("data-index");

    if (file) {
      const formData = new FormData();
      formData.append("Picture", file);

      try {
        await UpdatePictureImage({
          formData,
          userId: profile.id,
          imageIndex,
        });
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = (e) => {
          const updatedPictures = [...pictures];
          updatedPictures[imageIndex].PicturePic = e.target.result;
          setPictures(updatedPictures);
        };
      } catch (error) {
        console.error("Error uploading picture:", error);
      }
    }
  };
  const handleAddPicturesClick = () => {
    addPicturesRef.current.click();
  };
  const handleAddPicturesChange = async (event: any) => {
    const files = event.target.files;

    if (files.length > 0) {
      const formData = new FormData();
      const newPictures = [];

      Array.from(files).forEach((file) => {
        formData.append("Picture1", file);

        const reader = new FileReader();
        reader.readAsDataURL(file as Blob);
        reader.onload = (e) => {
          newPictures.push({
            PicturePic: e.target.result,
            PicturePicPublic: "",
          });
        };
      });

      try {
        await uploadPic({
          formData,
          userId: profile.id,
        });
        setPictures((prevPictures) => [...prevPictures, ...newPictures]);
      } catch (error) {
        console.error("Error uploading pictures:", error);
      }
    }
  };
  const handleUpdate = async (event: any) => {
    event.preventDefault();
    try {
      const id = localStorage.getItem("userId");
      await updateUserProfile({ userId: id, name, age: +age, email });
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };
  useEffect(() => {
    if (profile) {
      setIsUpdateDisabled(
        name === profile.name && +age === profile.age && email === profile.email
      );
    }
  }, [name, age, email, profile]);
  if (isLoading) {
    return <div>loading...</div>;
  }

  if (isError) {
    return <div>{error.message}</div>;
  }
  return (
    <div className="flex flex-col w-[calc(100%-20rem-1rem)] p-8 border-r-2 gap-10">
      <div className="flex border-b h-[max-content] w-full bg-slate-100 drop-shadow-lg rounded-lg p-4 gap-6">
        <div className="flex items-center justify-center bg-blue-100 size-48 p-4 rounded-lg self-center">
          <div
            className="size-48 overflow-hidden relative"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            onClick={handleProfilePicClick}
          >
            {profile1 ? (
              <Image
                alt="Profile picture"
                fill
                src={profile1}
                className="object-cover"
              />
            ) : (
              <RxAvatar className="text-9xl text-gray-400" />
            )}
            {hovered && (
              <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                <input
                  type="file"
                  ref={inputRef}
                  style={{ display: "none" }}
                  onChange={handleOnChange}
                />
                <FaPencilAlt
                  onClick={handleOnChoose}
                  className="text-white text-2xl"
                />
                <FaTrashAlt
                  onClick={handleDeleteProfileImage}
                  className="text-white text-2xl ml-4"
                />
              </div>
            )}
          </div>
        </div>
        <form className="flex flex-col gap-4" onSubmit={handleUpdate}>
          <div className="flex flex-col">
            <label className="text-blue-400">Name</label>
            <input
              placeholder="Joe"
              className="h-10 w-72 rounded-lg outline-none px-4"
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={isPending}
            />
          </div>
          <div className="flex flex-col">
            <label className="text-blue-400">Age</label>
            <select
              className="h-10 w-72 rounded-lg outline-none px-4"
              value={age}
              onChange={(e) => setAge(e.target.value)}
              disabled={isPending}
            >
              <option value="">Age</option>
              {ages.map((age) => (
                <option key={age} value={age} className="h-10">
                  {age}
                </option>
              ))}
            </select>
          </div>
          <div className="flex flex-col">
            <label className="text-blue-400">Email</label>
            <input
              placeholder="Joe@gmail.com"
              className="h-10 w-72 rounded-lg outline-none px-4"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isPending}
            />
          </div>
          <button
            type="submit"
            className={`w-[max-content] py-2 px-4 rounded-md self-end ${
              isPending || isUpdateDisabled ? "bg-gray-500" : "bg-blue-500"
            } text-white`}
            disabled={isPending || isUpdateDisabled}
          >
            {isPending ? "updating..." : "update"}
          </button>
        </form>
        <div className="flex flex-col items-center justify-end w-full">
          <h1 className="font-bold">{credits}</h1>
          <div className="w-40 flex items-center justify-center bg-blue-100 h-[max-content] p-4 rounded-lg">
            <button onClick={checkOutPage}>
              {checkoutPending ? "redirecting" : "checkout"}
            </button>
          </div>
        </div>
      </div>
      <div className="flex flex-col h-[max-content] w-full bg-slate-100 drop-shadow-lg rounded-lg p-4 gap-6">
        <div className="flex justify-between border-b-2">
          <div className="flex gap-2">
            <AiFillPicture className="text-2xl" />
            <h1>{`pictures(${pictures.length})`}</h1>
          </div>
          <div className="flex gap-2">
            <div
              onClick={handleAddPicturesClick}
              className="cursor-pointer flex"
            >
              <IoMdAdd className="text-2xl" />
              <h1>add pictures</h1>
            </div>

            <input
              type="file"
              ref={addPicturesRef}
              style={{ display: "none" }}
              multiple
              onChange={handleAddPicturesChange}
            />
          </div>
        </div>
        <div className="flex gap-3">
          {pictures?.map((picture, index) => (
            <div
              key={index}
              className="w-28 h-36 relative overflow-hidden rounded-lg"
              onMouseEnter={() => handlePictureMouseEnter(index)}
              onMouseLeave={() => handlePictureMouseLeave(index)}
            >
              <Image
                src={picture?.PicturePic}
                fill
                alt="Picture"
                className="object-cover"
              />
              {hoveredIndexes.includes(index) && (
                <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                  <input
                    type="file"
                    ref={inputRef1}
                    style={{ display: "none" }}
                    onChange={handleOnChangePicture}
                  />
                  <FaPencilAlt
                    onClick={() => handleOnChoosePicture(index)}
                    className="text-white text-2xl"
                  />
                  <FaTrashAlt
                    onClick={() => handleDeletePictureImage(index)}
                    className="text-white text-2xl ml-4"
                  />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
