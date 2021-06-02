package propen.impl.sipel.filestorage;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import java.io.BufferedOutputStream;
import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.net.MalformedURLException;
import java.net.URISyntaxException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.net.URI;

@Service
public class FileStorageService {

//    private final Path fileStorageLocation;

    private static String UPLOADED_FOLDER = System.getProperty("java.io.tmpdir");

    // constructor
    // pembuatan directory untuk menyimpan file di local server
//    @Autowired
//    public FileStorageService(FileStorageProperties fileStorageProperties) {
//        this.fileStorageLocation = Paths.get(fileStorageProperties.getUploadDir()).toAbsolutePath();
//
//        try{
//            Files.createDirectories(this.fileStorageLocation);
//        }catch (Exception e){
//            throw new FileStorageException("Directory untuk upload gagal dibuat");
//        }
//    }

    //  Menyimpan file ke local server
    public String storeFile(File uploadRootDir, String fileNameTarget, MultipartFile fileData){
        String fileName = fileNameTarget;

        try{
//           Path targetLocation = this.fileStorageLocation.resolve(fileName);
//            byte[] bytes = file.getBytes();
//            Path targetLocation = Paths.get(UPLOADED_FOLDER + fileName);
//            Path targetLocation = getFilePath(fileName);
//           Files.copy(file.getInputStream(), targetLocation, StandardCopyOption.REPLACE_EXISTING);
//            Files.write(targetLocation, bytes);
            File serverFile = new File(uploadRootDir.getAbsolutePath() + "/"+ fileName);
            System.out.println(serverFile.getAbsoluteFile());

            BufferedOutputStream stream = new BufferedOutputStream(new FileOutputStream(serverFile));
            stream.write(fileData.getBytes());
            stream.close();
           return fileName;
        }catch (IOException e){
            throw new FileStorageException("File "+fileName+" gagal disimpan, silahkan coba lagi!", e);
        }
    }

    // Mengambil file path
    public Path getFilePath(String fileName){
//        return this.fileStorageLocation.resolve(fileName).normalize();
        return Paths.get(UPLOADED_FOLDER + fileName);
    }

    // Mengakses file dari local server
    public Resource loadFileAsResource(String filePath, String fileName){
        try{
//            Path filePath = getFilePath(fileName);
//            Path filePath = Paths.get(UPLOADED_FOLDER + fileName);
//            Resource resource = new UrlResource(filePath.toUri());
            Resource resource = new UrlResource(new URI(filePath));
            if(resource.exists()){
                return resource;
            }else{
                throw new MyFileNotFoundException("File "+fileName+" tidak ditemukan");
            }
        }catch (MalformedURLException | URISyntaxException e){
            throw new MyFileNotFoundException("File "+fileName+" tidak ditemukan");
        }
    }

}
