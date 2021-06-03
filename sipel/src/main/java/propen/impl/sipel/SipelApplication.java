package propen.impl.sipel;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import propen.impl.sipel.filestorage.FileStorageProperties;

@SpringBootApplication
public class SipelApplication {

	public static void main(String[] args) {
		SpringApplication.run(SipelApplication.class, args);
	}

}
