package propen.impl.sipel.filestorage;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.InputStreamResource;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import java.io.*;
import java.net.MalformedURLException;
import java.net.URI;
import java.net.URISyntaxException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;

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
            throw new FileStorageException("File "+fileNameTarget+" gagal disimpan, silahkan coba lagi!", e);
        }
    }


    // Mengakses file dari local server
    public Resource loadFileAsResource(String filePath, String fileName){
        try{
            File file = new File(filePath);
            InputStreamResource resource = new InputStreamResource(new FileInputStream(file));
            if(resource.exists()){
                return resource;
            }else{
                throw new MyFileNotFoundException("File "+fileName+" tidak ditemukan");
            }
        }catch (FileNotFoundException e){
            throw new MyFileNotFoundException("File "+fileName+" tidak ditemukan");
        }
    }

}
