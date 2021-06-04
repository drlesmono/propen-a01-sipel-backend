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
import java.net.URI;
import java.net.URISyntaxException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.net.URI;

@Service
public class FileStorageService {

    // constructor
    // pembuatan directory untuk menyimpan file di local server
    public File storeFile(File uploadRootDir, String fileNameTarget, MultipartFile fileData){

        try{
            File serverFile = new File(uploadRootDir.getAbsolutePath() + "/"+ fileNameTarget);
            System.out.println(serverFile.getAbsoluteFile());

            BufferedOutputStream stream = new BufferedOutputStream(new FileOutputStream(serverFile));
            stream.write(fileData.getBytes());
            stream.close();
            return serverFile;
        }catch (IOException e){
            throw new FileStorageException("File "+fileName+" gagal disimpan, silahkan coba lagi!", e);
        }
    }

    // Mengambil file path
    public Path getFilePath(String fileName){
        return this.fileStorageLocation.resolve(fileName).normalize();
    }

    // Mengakses file dari local server
    public Resource loadFileAsResource(String filePath, String fileName){
        try{
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
