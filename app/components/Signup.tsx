"use client";
import React, { useRef, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import SignupData from "../actions/SignupData";
import SignupDataImage from "../actions/SignupDataImage";
import { AiFillPicture } from "react-icons/ai";
import { IoMdAdd } from "react-icons/io";
import { FaPencilAlt, FaTrashAlt } from "react-icons/fa";
import Image from "next/image";
import Link from "next/link";

export default function Signup() {
  const ProfileRef = useRef();
  const PictureRef = useRef();
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm();
  const [images, setImages] = useState([]);
  const [profilePic, setProfilePic] = useState(null);
  const [profilePicData, setProfilePicData] = useState(null);
  const [imagePreviews, setImagePreviews] = useState([]);
  const generateAges = () => {
    const ages = [];
    for (let age = 18; age <= 80; age++) {
      ages.push(age);
    }
    return ages;
  };

  const ages = generateAges();

  const { mutateAsync, isPending, isError, error } = useMutation({
    mutationFn: SignupData,
    onSuccess: (data) => {
      localStorage.setItem("userId", data.id);
      window.location.href = "/chat";
    },
  });

  const {
    mutateAsync: imageMutateAsync,
    isPending: imagePending,
    isError: imageError,
    error: imageE,
  } = useMutation({
    mutationFn: SignupDataImage,
  });

  const onSubmit = async (data: any) => {
    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("email", data.email);
    formData.append("password", data.password);
    formData.append("age", data.age);
    formData.append("sex", data.sex);
    if (profilePic) {
      formData.append("ProfilePic", profilePic);
    }
    try {
      await mutateAsync(formData);
      const formData1 = new FormData();
      images.forEach((image) => {
        formData1.append("Picture", image);
      });
      await imageMutateAsync(formData1);
    } catch (e) {
      console.log(e);
    }

    reset();
    setImages([]);
    setProfilePic(null);
    setProfilePicData(null);
    setImagePreviews([]);
  };

  const handleFileChange = (e: any) => {
    const files = Array.from(e.target.files);
    const fileReaders = files.map((file) => {
      const reader = new FileReader();
      reader.readAsDataURL(file as Blob);
      return new Promise((resolve) => {
        reader.onload = () => {
          resolve({ file, data: reader.result });
        };
      });
    });

    Promise.all(fileReaders).then((results) => {
      //@ts-ignore
      const newImages = results.map((result) => result.file);
      //@ts-ignore
      const newImagePreviews = results.map((result) => result.data);
      //@ts-ignore
      setImages((prevImages) => [...prevImages, ...newImages]);
      //@ts-ignore
      setImagePreviews((prevPreviews) => [
        ...prevPreviews,
        ...newImagePreviews,
      ]);
      setValue("images", newImages);
    });
  };

  const handleProfileChange = (e: any) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        setProfilePic(file);
        //@ts-ignore
        setProfilePicData(reader.result);
        setValue("profilePic", file);
      };
    }
  };

  const removeProfilePic = () => {
    setProfilePic(null);
    setProfilePicData(null);
    setValue("profilePic", null);
  };

  const editProfilePic = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.onchange = (e) => {
      //@ts-ignore
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => {
          setProfilePic(file);
          //@ts-ignore
          setProfilePicData(reader.result);
          setValue("profilePic", file);
        };
      }
    };
    input.click();
  };

  const removeImage = (index: any) => {
    setImages((prevImages) => prevImages.filter((_, i) => i !== index));
    setImagePreviews((prevPreviews) =>
      prevPreviews.filter((_, i) => i !== index)
    );
  };

  const editImage = (index: any) => {
    const input = document.createElement("input");
    input.type = "file";
    input.onchange = (e) => {
      //@ts-ignore
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => {
          setImages((prevImages) => {
            const newImages = [...prevImages];
            //@ts-ignore
            newImages[index] = file;
            return newImages;
          });
          setImagePreviews((prevPreviews) => {
            const newPreviews = [...prevPreviews];
            //@ts-ignore
            newPreviews[index] = reader.result;
            return newPreviews;
          });
        };
      }
    };
    input.click();
  };
  const ProfileClick = () => {
    //@ts-ignore
    ProfileRef?.current.click();
  };
  const PictureClick = () => {
    //@ts-ignore
    PictureRef?.current.click();
  };
  return (
    <form
      className="w-screen h-[max-content] flex flex-col gap-2 justify-center items-center  my-10"
      onSubmit={handleSubmit(onSubmit)}
    >
      <input
        type="text"
        placeholder="name"
        className="p-4 outline-none"
        {...register("name", { required: true })}
      />
      {errors.name && <span>Name is required</span>}

      <input
        type="email"
        placeholder="email"
        className="p-4 outline-none"
        {...register("email", { required: true, pattern: /^\S+@\S+$/i })}
      />
      {errors.email && <span>Email is required and must be valid</span>}

      <input
        type="password"
        placeholder="password"
        className="p-4 outline-none"
        {...register("password", { required: true, minLength: 6 })}
      />
      {errors.password && (
        <span>Password is required and must be at least 6 characters</span>
      )}

      <select
        className="outline-none p-4"
        {...register("age", { required: true })}
        disabled={isPending}
      >
        <option value="">Age</option>
        {ages.map((age) => (
          <option key={age} value={age} className="h-10">
            {age}
          </option>
        ))}
      </select>
      {errors.age && <span>Age is required</span>}

      <select
        className={`p-4 text-gray-400 outline-none`}
        {...register("sex", { required: true })}
      >
        <option value="">Select Sex</option>
        <option value="M" className="text-black">
          Male
        </option>
        <option value="F" className="text-black">
          Female
        </option>
      </select>
      {errors.sex && <span>Sex is required</span>}

      {isError && <div>{error.message}</div>}
      {isPending && !isError ? (
        <div>uploading profilePic...</div>
      ) : (
        <>
          <div className=" flex flex-col items-center justify-center">
            {profilePicData ? (
              <div className="relative group">
                <Image
                  src={profilePicData}
                  alt="profilePic"
                  width="128"
                  height="128"
                  className="object-cover"
                />
                <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    type="button"
                    onClick={editProfilePic}
                    className="text-white p-2"
                  >
                    <FaPencilAlt />
                  </button>
                  <button
                    type="button"
                    onClick={removeProfilePic}
                    className="text-white p-2"
                  >
                    <FaTrashAlt />
                  </button>
                </div>
              </div>
            ) : (
              <button
                type="button"
                onClick={ProfileClick}
                {...register("profilePic", { required: true })}
                className="bg-blue-400 text-white py-2 px-4 rounded-md flex items-center gap-2"
              >
                <IoMdAdd />
                Upload Profile Picture
              </button>
            )}
            {!profilePic && errors.profilePic && (
              <span>Profile picture is required</span>
            )}
            <input
              id="profilePicInput"
              //@ts-ignore
              ref={ProfileRef}
              type="file"
              onChange={handleProfileChange}
              style={{ display: "none" }}
            />
          </div>
        </>
      )}

      {imageError && <div>{imageE.message}</div>}
      {imagePending && !imageError ? (
        <div>uploading pictures...</div>
      ) : (
        <>
          <button
            type="button"
            onClick={PictureClick}
            {...register("Picture", { required: true })}
            className="bg-blue-400 text-white py-2 px-4 rounded-md flex items-center gap-2"
          >
            <IoMdAdd />
            Upload Images
          </button>
          <div className="image-preview flex flex-wrap gap-2">
            <input
              //@ts-ignore
              ref={PictureRef}
              id="fileInput"
              type="file"
              multiple
              onChange={handleFileChange}
              style={{ display: "none" }}
            />
            {imagePreviews.map((preview, index) => (
              <div key={index} className="relative group">
                <Image
                  src={preview}
                  alt={`upload-${index}`}
                  width="128"
                  height="128"
                  className="object-cover"
                />
                <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    type="button"
                    onClick={() => editImage(index)}
                    className="text-white p-2"
                  >
                    <FaPencilAlt />
                  </button>
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="text-white p-2"
                  >
                    <FaTrashAlt />
                  </button>
                </div>
              </div>
            ))}
          </div>
          {errors.Picture && imagePreviews.length === 0 && (
            <span>Images are required</span>
          )}
        </>
      )}

      <button
        type="submit"
        className="bg-blue-400 text-white py-2 px-4 rounded-md"
      >
        signup
      </button>
      <div className="flex gap-2">
        <h1> have an account?</h1>
        <Link href="/login" className="text-blue-500">
          Login
        </Link>
      </div>
    </form>
  );
}
