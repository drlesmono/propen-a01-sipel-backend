package propen.impl.sipel.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import propen.impl.sipel.model.OrderModel;
import propen.impl.sipel.service.OrderRestService;

import java.util.List;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/test")
public class TestController {

	@Autowired
	private OrderRestService orderRestService;

	@GetMapping("/all")
	public List<OrderModel> allAccess() {
		return orderRestService.retrieveListOrderVerified();
	}
	
	@GetMapping("/admin")
	//@PreAuthorize("hasRole('MANAGER') or hasRole('ADMIN')")
	public List<OrderModel> adminAccess() {
		return orderRestService.retrieveListOrderVerified();
	}

	@GetMapping(value="/ordersVerified")
	@PreAuthorize("hasRole('ADMIN') or hasRole('MANAGER')")
	public List<OrderModel> retrieveListOrderVerified(){
		return orderRestService.retrieveListOrderVerified();
	}

	@GetMapping("/manager")
	@PreAuthorize("hasRole('MANAGER')")
	public String managerAccess() {
		return "Manager Board.";
	}

	@GetMapping("/engineer")
	@PreAuthorize("hasRole('ENGINEER')")
	public String engineerAccess() {
		return "Engineer Board.";
	}

	@GetMapping("/data-entry")
	@PreAuthorize("hasRole('DATA_ENTRY')")
	public String dataEntryAccess() {
		return "Data Entry Board.";
	}

	@GetMapping("/finance")
	@PreAuthorize("hasRole('FINANCE')")
	public String FinanceAccess() {
		return "Finance Board.";
	}

}
