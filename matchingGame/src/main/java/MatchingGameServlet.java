import javax.servlet.ServletException;
import javax.servlet.http.*;
import java.io.File;
import java.io.IOException;
import java.io.PrintWriter;
import java.util.*;

public class MatchingGameServlet extends HttpServlet {
    public void doGet (HttpServletRequest req,
                       HttpServletResponse res)
            throws ServletException, IOException
    {
        File imagePath = new File(getServletContext().getRealPath("/images"));
        List<File> imageFiles = Arrays.asList(imagePath.listFiles());
        Collections.shuffle(Arrays.asList(imageFiles));
        StringBuilder sb = new StringBuilder();
        for (int i = 0; i < 8; i++)
        {
            sb.append("images/");
            sb.append(imageFiles.get(i).getName());
            if (i != 7)
            {
                sb.append(",");
            }
        }
        res.setContentType("text/plain;charset=UTF-8");
        PrintWriter out = res.getWriter();
        out.println(sb.toString());
        out.close();
    }

}
