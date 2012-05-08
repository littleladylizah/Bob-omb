// vim: set sw=4 ts=4 et:
package ee.ut.cs.vl.bobomb.controller;

import java.io.IOException;

import javax.servlet.ServletConfig;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.expressme.openid.Association;
import org.expressme.openid.Authentication;
import org.expressme.openid.Endpoint;
import org.expressme.openid.OpenIdManager;

@WebServlet("/login")
public class LoginServlet extends HttpServlet {

    private static final long serialVersionUID = 1L;

    public static final String URL = "http://bobomb.jelastic.dogado.eu";
    public static final String ATTR_PLAYER = "player_name";

    private static final String PARAM_NONCE = "openid.response_nonce";
    private static final String ATTR_MAC = "openid_mac";
    private static final String ATTR_ALIAS = "openid_alias";

    private OpenIdManager manager;

    @Override
    public void init(ServletConfig config) throws ServletException {
        manager = new OpenIdManager();
        manager.setRealm(URL);
        manager.setReturnTo(URL.concat("/login"));
    }

    @Override
    public void doGet(HttpServletRequest req, HttpServletResponse resp)
            throws ServletException, IOException {
        if (req.getSession().getAttribute(LoginServlet.ATTR_PLAYER) == null) {
            authenticate(req, resp);
        } else {
            sendHome(req, resp);
        }
    }

    private void sendHome(HttpServletRequest req, HttpServletResponse resp)
            throws ServletException, IOException {
        req.getRequestDispatcher("/index.jsp").forward(req, resp);
    }

    private void authenticate(HttpServletRequest req, HttpServletResponse resp)
            throws IOException, ServletException {
        if (req.getParameter(PARAM_NONCE) == null) {
            sendAuthRequest(req, resp);
        } else {
            handleAuthResp(req, resp);
        }
    }

    private void sendAuthRequest(HttpServletRequest req, HttpServletResponse resp)
            throws IOException {
        Endpoint endpoint = manager.lookupEndpoint("Google");
        Association association = manager.lookupAssociation(endpoint);
        req.getSession().setAttribute(ATTR_MAC, association.getRawMacKey());
        req.getSession().setAttribute(ATTR_ALIAS, endpoint.getAlias());
        String authUrl = manager.getAuthenticationUrl(endpoint, association);
        resp.sendRedirect(authUrl);
    }

    private void handleAuthResp(HttpServletRequest req, HttpServletResponse resp)
            throws ServletException, IOException {
        checkNonce(req.getParameter(PARAM_NONCE));
        byte[] mac = (byte[]) req.getSession().getAttribute(ATTR_MAC);
        String alias = (String) req.getSession().getAttribute(ATTR_ALIAS);
        Authentication auth = manager.getAuthentication(req, mac, alias);
        String name = auth.getFullname();
        req.getSession().setAttribute(ATTR_PLAYER, name);
        sendHome(req, resp);
    }

    private void checkNonce(String parameter) {
        // Here should be some code that protects against replay-attacks :)
    }

}
