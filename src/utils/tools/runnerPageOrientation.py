from PIL import Image
import pytesseract
import os

def fix_image_orientation_in_place(image_path):
    """
    Fix the orientation of an image containing text and overwrite the existing image.
    
    :param image_path: Path to the image file to be corrected.
    """
    try:
        # Open the image
        image = Image.open(image_path)

        # Use Tesseract to detect orientation
        osd_data = pytesseract.image_to_osd(image, output_type=pytesseract.Output.DICT)
        angle = osd_data.get('rotate', 0)  # Rotation angle
        script = osd_data.get('script', 'Unknown')  # Detected script

        if angle != 0:
            # Rotate the image to fix orientation
            corrected_image = image.rotate(-angle, expand=True)
            corrected_image.save(image_path)
            print(f"Orientation corrected and saved in-place for: {image_path}")
        else:
            print(f"No rotation needed. Detected script: {script}. Image remains unchanged.")

    except Exception as e:
        print(f"An error occurred: {e}")

if __name__ == "__main__":
    # Path to the image to be corrected
    # image_path = "image.jpg"  # Replace with your image file path
    # Get all image files from directory recursively
    image_files = []
    directory = "../../data-img/RA 8"  # Replace with your directory path
    
    for root, dirs, files in os.walk(directory):
        for file in files:
            if file.lower().endswith(('.png', '.jpg', '.jpeg', '.tiff', '.bmp')):
                image_files.append(os.path.join(root, file))
    
    print(f"Found {len(image_files)} images")
    # print(image_files)
      # Using first image for testing
    count = 0
    total = len(image_files)
    for image_path in image_files:
        fix_image_orientation_in_place(image_path)
        print(f"Done with {count + 1} out of {total} images")
        count += 1
