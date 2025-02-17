import { getStorage, ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { getDatabase, ref as dbRef, set, update, child } from 'firebase/database';
import { v4 as uuidv4 } from 'uuid';

// Initialize Firebase Storage and Database
const storage = getStorage();
const database = getDatabase();

// Function to upload image to Firebase Storage
const uploadImageToFirebaseStorage = (file) => {
  return new Promise((resolve, reject) => {
    const storageRef = ref(storage, `experiences/${uuidv4()}_${file.name}`);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      'state_changed',
      null,
      (error) => reject(error),
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          resolve(downloadURL); // Return the URL of the uploaded image
        });
      }
    );
  });
};

// Function to save a new experience to Firebase
const saveExperience = async (experienceData, imageFile) => {
  try {
    let imageURL = '';
    
    if (imageFile) {
      // Upload image if a file is provided
      imageURL = await uploadImageToFirebaseStorage(imageFile);
    }

    // Save the experience data along with the image URL to Firebase Realtime Database
    const experienceRef = dbRef(database, 'experiences/' + uuidv4());
    await set(experienceRef, {
      ...experienceData,
      companyLogo: imageURL, // Store image URL
    });

    console.log("Experience saved successfully!");
  } catch (error) {
    console.error("Error saving experience: ", error);
  }
};

// Function to update an existing experience in Firebase
const updateExperience = async (id, experienceData, imageFile) => {
  try {
    let imageURL = experienceData.companyLogo;

    if (imageFile) {
      // If a new image is provided, upload it and get the new image URL
      imageURL = await uploadImageToFirebaseStorage(imageFile);
    }

    const experienceRef = dbRef(database, 'experiences/' + id);
    await update(experienceRef, {
      ...experienceData,
      companyLogo: imageURL, // Update the image URL
    });

    console.log("Experience updated successfully!");
  } catch (error) {
    console.error("Error updating experience: ", error);
  }
};

// Function to delete an experience from Firebase
const deleteExperience = async (id) => {
  try {
    const experienceRef = dbRef(database, 'experiences/' + id);
    await remove(experienceRef);
    console.log("Experience deleted successfully!");
  } catch (error) {
    console.error("Error deleting experience: ", error);
  }
};

export { saveExperience, updateExperience, deleteExperience };
