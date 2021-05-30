package propen.impl.sipel.filestorage;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.net.MalformedURLException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;

@Service
public class FileStorageService {

    private final Path fileStorageLocation;

    // constructor
    // pembuatan directory untuk menyimpan file di local server
    @Autowired
    public FileStorageService(FileStorageProperties fileStorageProperties) {
        this.fileStorageLocation = Paths.get(fileStorageProperties.getUploadDir()).toAbsolutePath();

        try{
            Files.createDirectories(this.fileStorageLocation);
        }catch (Exception e){
            throw new FileStorageException("Directory untuk upload gagal dibuat");
        }
    }

    //  Menyimpan file ke local server
    public String storeFile(MultipartFile file, String fileNameTarget){
        String fileName = fileNameTarget;
        try{
           Path targetLocation = this.fileStorageLocation.resolve(fileName);
           Files.copy(file.getInputStream(), targetLocation, StandardCopyOption.REPLACE_EXISTING);
           return fileName;
        }catch (IOException e){
            throw new FileStorageException("File "+fileName+" gagal disimpan, silahkan coba lagi!", e);
        }
    }

    // Mengambil file path
    public Path getFilePath(String fileName){
        return this.fileStorageLocation.resolve(fileName).normalize();
    }

    // Mengakses file dari local server
    public Resource loadFileAsResource(String fileName){
        try{
            Path filePath = getFilePath(fileName);
            Resource resource = new UrlResource(filePath.toUri());
            if(resource.exists()){
                return resource;
            }else{
                throw new MyFileNotFoundException("File "+fileName+" tidak ditemukan");
            }
        }catch (MalformedURLException e){
            throw new MyFileNotFoundException("File "+fileName+" tidak ditemukan");
        }
    }

}
