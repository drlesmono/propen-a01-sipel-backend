package propen.impl.sipel.controller;

import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

import javax.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import propen.impl.sipel.model.ERole;
import propen.impl.sipel.model.RoleModel;
import propen.impl.sipel.model.UserModel;
import propen.impl.sipel.payload.request.LoginRequest;
import propen.impl.sipel.payload.request.SignupRequest;
import propen.impl.sipel.payload.response.JwtResponse;
import propen.impl.sipel.payload.response.MessageResponse;
import propen.impl.sipel.security.jwt.JwtUtils;
import propen.impl.sipel.security.services.UserDetailsImpl;
import propen.impl.sipel.repository.RoleDb;
import propen.impl.sipel.repository.UserDb;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/auth")
public class AuthController {
	@Autowired
	AuthenticationManager authenticationManager;

	@Autowired
	UserDb userRepository;

	@Autowired
	RoleDb roleRepository;

	@Autowired
	PasswordEncoder encoder;

	@Autowired
	JwtUtils jwtUtils;

	@PostMapping("/signin")
	public ResponseEntity<?> authenticateUser(@Valid @RequestBody LoginRequest loginRequest) {

		Authentication authentication = authenticationManager.authenticate(
				new UsernamePasswordAuthenticationToken(loginRequest.getUsername(), loginRequest.getPassword()));

		SecurityContextHolder.getContext().setAuthentication(authentication);
		String jwt = jwtUtils.generateJwtToken(authentication);
		
		UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();		
		List<String> roles = userDetails.getAuthorities().stream()
				.map(item -> item.getAuthority())
				.collect(Collectors.toList());

		return ResponseEntity.ok(new JwtResponse(jwt, 
												 userDetails.getId(), 
												 userDetails.getUsername(), 
												 userDetails.getEmail(),
												 userDetails.getNip(),
												 userDetails.getRole_name(),
												 userDetails.getFullname(),
												 userDetails.getSurname(),
												 roles));
	}

	@PostMapping("/signup")
	public ResponseEntity<?> registerUser(@Valid @RequestBody SignupRequest signUpRequest) {
		if (userRepository.existsByUsername(signUpRequest.getUsername())) {
			return ResponseEntity
					.badRequest()
					.body(new MessageResponse("Error: Username is already taken!"));
		}

		if (userRepository.existsByEmail(signUpRequest.getEmail())) {
			return ResponseEntity
					.badRequest()
					.body(new MessageResponse("Error: Email is already in use!"));
		}

		// Create new user's account
		UserModel user = new UserModel(signUpRequest.getFullname(),
							 signUpRequest.getSurname(),
							 signUpRequest.getEmail(),
							 signUpRequest.getNip(),
							 signUpRequest.getUsername(),
							 signUpRequest.getRole_name(),
							 encoder.encode(signUpRequest.getPassword()));

		Set<String> strRoles = new HashSet<>(); //dari signUpRequest.getRole diubah jadi new HashSet<>();
		strRoles.add(signUpRequest.getRole_name()); //nambah line code
		Set<RoleModel> roles = new HashSet<>(); //tadinya ini ga dicomment


		if (strRoles == null) {
			RoleModel noneRole = roleRepository.findByName(ERole.ROLE_NONE)
					.orElseThrow(() -> new RuntimeException("Error: Role is not found."));
			roles.add(noneRole);
			user.setRole_name("None");
		} else {
			strRoles.forEach(role -> {
				switch (role) {
				case "Manager":
					RoleModel managerRole = roleRepository.findByName(ERole.ROLE_MANAGER)
							.orElseThrow(() -> new RuntimeException("Error: Role is not found."));
					roles.add(managerRole);
					user.setRole_name("Manager");

					break;
				case "Data Entry":
					RoleModel dataEntryRole = roleRepository.findByName(ERole.ROLE_DATA_ENTRY)
							.orElseThrow(() -> new RuntimeException("Error: Role is not found."));
					roles.add(dataEntryRole);
					user.setRole_name("Data Entry");

					break;
				case "Engineer":
					RoleModel engineerRole = roleRepository.findByName(ERole.ROLE_ENGINEER)
							.orElseThrow(() -> new RuntimeException("Error: Role is not found."));
					roles.add(engineerRole);
					user.setRole_name("Engineer");

					break;

				case "Finance":
					RoleModel financeRole = roleRepository.findByName(ERole.ROLE_FINANCE)
							.orElseThrow(() -> new RuntimeException("Error: Role is not found."));
					roles.add(financeRole);
					user.setRole_name("Finance");

					break;
				
				case "Admin":
				RoleModel adminRole = roleRepository.findByName(ERole.ROLE_ADMIN)
						.orElseThrow(() -> new RuntimeException("Error: Role is not found."));
				roles.add(adminRole);
				user.setRole_name("Admin");

				break;

				default:
					RoleModel noneRole = roleRepository.findByName(ERole.ROLE_NONE)
							.orElseThrow(() -> new RuntimeException("Error: Role is not found."));
					roles.add(noneRole);
					user.setRole_name("None");
				}
			});
		}

		user.setRoles(roles);
		userRepository.save(user);

		return ResponseEntity.ok(new MessageResponse("User registered successfully!"));
	}
}
