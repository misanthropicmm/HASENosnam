<%@ page import="java.io.*"%>
<html>
<body>
<% 
	// http://127.0.0.1:8080/StockD/Test.jsp?stockId=2800
	
	String stockId = request.getParameter("stockId");
   	String fName = "/Users/mansonching/Documents/stock_workspace/StockD/WebContent/CSV/"+stockId+".HK.csv";
   	String thisLine; 
  	int count=0; 
  	FileInputStream fis = new FileInputStream(fName);
  	DataInputStream myInput = new DataInputStream(fis);
  	int i=0; 

	// Day block
	int dayBlock = request.getParameter("dayBlock") != null? Integer.parseInt(request.getParameter("dayBlock")) : 0;
%>
<table>

<form action = "Test.jsp" method = "GET">
	Existing Continuous Rate <input type = "text" name = "existRate" value="0"><br>
	
	Day <input type = "text" name = "dayBlock" value="<%=dayBlock%>"><br>
	Range 1<input type = "text" name = "range1" value="0.5"><br>
	Range 2<input type = "text" name = "range2" value="1"><br>
	Range 3<input type = "text" name = "range3" value="1.5"><br>
	Range 4<input type = "text" name = "range4" value="2"><br>
	Range 5<input type = "text" name = "range5" value="2.5"><br>
	Range 6<input type = "text" name = "range6" value="3"><br>
	Range 7<input type = "text" name = "range7" value="3.5"><br>
	Range 8<input type = "text" name = "range8" value="4"><br>
	Range 9<input type = "text" name = "range9" value="5"><br>
	Range 10<input type = "text" name = "range10" value = "100"><br>
	Stock ID <input type = "text" name = "stockId" value="<%=stockId%>"><br>
	<input type = "submit" value = "Submit" /><br>

<%
	double[] wholeRange=new double[10000];
	double[] dayBlockRange=new double[10000];
	double[] highPrice = new double[10000];
	double[] lowPrice = new double[10000];
	double[] adjClose = new double[10000];
	double[] continueUpRate = new double[10000];
	double[] continueDownRate = new double[10000];
	double[] openPrice = new double[100000];
	double[] closePrice = new double[100000];
	double[] openClose = new double[100000];
	
	
	int continueUpRateCount = 0;
	int continueDownRateCount = 0;
	int keepState = 0;
	int switchState = 0;
	
	
	
	// Range variables
	double ran1 = request.getParameter("range1") != null? Double.parseDouble(request.getParameter("range1")) : 0;
	int totalRan1 = 0;
	double ran2 = request.getParameter("range2") != null? Double.parseDouble(request.getParameter("range2")) : 0;
	int totalRan2 = 0;
	double ran3 = request.getParameter("range3") != null? Double.parseDouble(request.getParameter("range3")) : 0;
	int totalRan3 = 0;
	double ran4 = request.getParameter("range4") != null? Double.parseDouble(request.getParameter("range4")) : 0;
	int totalRan4 = 0;
	double ran5 = request.getParameter("range5") != null? Double.parseDouble(request.getParameter("range5")) : 0;
	int totalRan5 = 0;
	double ran6 = request.getParameter("range6") != null? Double.parseDouble(request.getParameter("range6")) : 0;
	int totalRan6 = 0;
	double ran7 = request.getParameter("range7") != null? Double.parseDouble(request.getParameter("range7")) : 0;
	int totalRan7 = 0;
	double ran8 = request.getParameter("range8") != null? Double.parseDouble(request.getParameter("range8")) : 0;
	int totalRan8 = 0;
	double ran9 = request.getParameter("range9") != null? Double.parseDouble(request.getParameter("range9")) : 0;
	int totalRan9 = 0;
	double ran10 = request.getParameter("range10") != null? Double.parseDouble(request.getParameter("range10")) : 0;
	int totalRan10 = 0;
	
	// Determine it is up or down 
	boolean upSign = true;
	boolean previousUpSign = true;
	int lineCount = 0;
	
	while ((thisLine = myInput.readLine()) != null)
	{
		String strar[] = thisLine.split(",");
		// Date Open High Low Close CloseAdj CloseVolume
		
				
		
		for(int j=0;j<strar.length;j++)
		{
			if (j==strar.length-1 && i!=0) {
				lineCount ++;
				// Close - Open
				openPrice[i] = Double.parseDouble(strar[1]);
				closePrice[i] = Double.parseDouble(strar[4]);
			
				adjClose[i] = (Double.parseDouble(strar[4]) - Double.parseDouble(strar[1]))/Double.parseDouble(strar[1])*100;
				if (adjClose[i] >=0) {
					upSign = true;
				} else {
					upSign = false;
				}
				
				if (previousUpSign == upSign) {
					keepState++;
					if (upSign) {
						continueUpRate[continueUpRateCount] += adjClose[i];
						//out.println("<br>upup1 " +continueUpRate[continueUpRateCount]);
					} else {
						continueDownRate[continueDownRateCount] += adjClose[i];
						//out.println("<br>upu2p " + adjClose[i] + " " + Double.parseDouble(strar[5]) + " " + Double.parseDouble(strar[1]) + " " + continueDownRate[continueDownRateCount]);
					}
				} else {
					switchState++;
					if (upSign) {
						continueUpRateCount++;
						continueUpRate[continueUpRateCount] = adjClose[i];
						//out.println("<br>upu3p " + continueUpRate[continueUpRateCount]);
					} else {
						continueDownRateCount++;
						continueDownRate[continueDownRateCount] = adjClose[i];
						//out.println("<br>upu4p " + continueDownRate[continueDownRateCount]);
					}
				}
				
				
				previousUpSign = upSign;
				
				highPrice[i] = Double.parseDouble(strar[2]);
				lowPrice[i] = Double.parseDouble(strar[3]) ;
				
				wholeRange[i] = (Double.parseDouble(strar[2]) - Double.parseDouble(strar[3]))/ Double.parseDouble(strar[3]) * 100;
				
				if (wholeRange[i]>=ran1 && wholeRange[i]<ran2) {
					totalRan1++;
				}
				
				if (wholeRange[i]>=ran2 && wholeRange[i]<ran3) {
					totalRan2++;
				}
				
				if (wholeRange[i]>=ran3 && wholeRange[i]<ran4) {
					totalRan3++;
				}
				
				if (wholeRange[i]>=ran4 && wholeRange[i]<ran5) {
					totalRan4++;
				}
				
				if (wholeRange[i]>=ran5 && wholeRange[i]<ran6) {
					totalRan5++;
				}
				
				if (wholeRange[i]>=ran6 && wholeRange[i]<ran7) {
					totalRan6++;
				}
				
				if (wholeRange[i]>=ran7 && wholeRange[i]<ran8) {
					totalRan7++;
				}
				
				if (wholeRange[i]>=ran8 && wholeRange[i]<ran9) {
					totalRan8++;
				}
				
				if (wholeRange[i]>=ran9 && wholeRange[i]<ran10) {
					totalRan9++;
				}
				
				//out.print("<b>Daily Range</b> " + wholeRange[i]);
			}
		}
		
		// Range calculation
		for(int j=0;j<strar.length;j++)
		{
			if (j==strar.length-1 && i!=0) {
				dayBlockRange[i] = (Double.parseDouble(strar[2]) - Double.parseDouble(strar[3]))/ Double.parseDouble(strar[3]) * 100;
				
				if (wholeRange[i]>=ran1 && wholeRange[i]<ran2) {
					totalRan1++;
				}
				
				if (wholeRange[i]>=ran2 && wholeRange[i]<ran3) {
					totalRan2++;
				}
				
				if (wholeRange[i]>=ran3 && wholeRange[i]<ran4) {
					totalRan3++;
				}
				
				if (wholeRange[i]>=ran4 && wholeRange[i]<ran5) {
					totalRan4++;
				}
				
				if (wholeRange[i]>=ran5 && wholeRange[i]<ran6) {
					totalRan5++;
				}
				
				if (wholeRange[i]>=ran6 && wholeRange[i]<ran7) {
					totalRan6++;
				}
				
				if (wholeRange[i]>=ran7 && wholeRange[i]<ran8) {
					totalRan7++;
				}
				
				if (wholeRange[i]>=ran8 && wholeRange[i]<ran9) {
					totalRan8++;
				}
				
				if (wholeRange[i]>=ran9 && wholeRange[i]<ran10) {
					totalRan9++;
				}
				
			}
		}
		
		// Day block calculation
		for(int j=0;j<strar.length;j++)
		{
			if (j==strar.length-1 && i!=0) {
				dayBlockRange[i] = (Double.parseDouble(strar[2]) - Double.parseDouble(strar[3]))/ Double.parseDouble(strar[3]) * 100;
				
				if (wholeRange[i]>=ran1 && wholeRange[i]<ran2) {
					totalRan1++;
				}
				
				if (wholeRange[i]>=ran2 && wholeRange[i]<ran3) {
					totalRan2++;
				}
				
				if (wholeRange[i]>=ran3 && wholeRange[i]<ran4) {
					totalRan3++;
				}
				
				if (wholeRange[i]>=ran4 && wholeRange[i]<ran5) {
					totalRan4++;
				}
				
				if (wholeRange[i]>=ran5 && wholeRange[i]<ran6) {
					totalRan5++;
				}
				
				if (wholeRange[i]>=ran6 && wholeRange[i]<ran7) {
					totalRan6++;
				}
				
				if (wholeRange[i]>=ran7 && wholeRange[i]<ran8) {
					totalRan7++;
				}
				
				if (wholeRange[i]>=ran8 && wholeRange[i]<ran9) {
					totalRan8++;
				}
				
				if (wholeRange[i]>=ran9 && wholeRange[i]<ran10) {
					totalRan9++;
				}
				
			}
		}
		
		i++;
	} 
	
	
	out.println(printUpGraph("Continue Up: ", continueUpRate,continueUpRateCount));
	out.println(printDownGraph("Continue Down: ",continueDownRate,continueDownRateCount));
	
	
	
	
	// Summary
	out.println("<br>");
	out.println("<br>Day: " + dayBlock);
	out.println("<br>Keep state: " + keepState);
	out.println("<br>Switch state: " + switchState);
	out.println("<br>");
	out.println("<br> No. of records read: " + lineCount);
	
	int totalRanTotal = totalRan1 + totalRan2 + totalRan3 + totalRan4 + totalRan5 + totalRan6 + totalRan7 + totalRan8 + totalRan9;
	
	out.println("<br>Range 1: " + (double)totalRan1/totalRanTotal*100 + " -- " + totalRanTotal + " -- " + request.getParameter("range1") + " - " + request.getParameter("range2"));
	out.println("<br>Range 2: " + (double)totalRan2/totalRanTotal*100 + " -- " + totalRanTotal + " -- " + request.getParameter("range2") + " - " + request.getParameter("range3"));
	out.println("<br>Range 3: " + (double)totalRan3/totalRanTotal*100 + " -- " + totalRanTotal + " -- " + request.getParameter("range3") + " - " + request.getParameter("range4"));
	out.println("<br>Range 4: " + (double)totalRan4/totalRanTotal*100 + " -- " + totalRanTotal + " -- " + request.getParameter("range4") + " - " + request.getParameter("range5"));
	out.println("<br>Range 5: " + (double)totalRan5/totalRanTotal*100 + " -- " + totalRanTotal + " -- " + request.getParameter("range5") + " - " + request.getParameter("range6"));
	out.println("<br>Range 6: " + (double)totalRan6/totalRanTotal*100 + " -- " + totalRanTotal + " -- " + request.getParameter("range6") + " - " + request.getParameter("range7"));
	out.println("<br>Range 7: " + (double)totalRan7/totalRanTotal*100 + " -- " + totalRanTotal + " -- " + request.getParameter("range7") + " - " + request.getParameter("range8"));
	out.println("<br>Range 8: " + (double)totalRan8/totalRanTotal*100 + " -- " + totalRanTotal + " -- " + request.getParameter("range8") + " - " + request.getParameter("range9"));
	out.println("<br>Range 9: " + (double)totalRan9/totalRanTotal*100 + " -- " + totalRanTotal + " -- " + request.getParameter("range9") + " - " + request.getParameter("range10"));

	
	out.println("<br>");
	// Day Range average
	

	for (int y = 1; y < lineCount - dayBlock; y++) {
		openClose[y] = (double)(closePrice[y + dayBlock]-openPrice[y])/openPrice[y]*100;
		//out.println("<br>Day between: " + (double)(closePrice[y + dayBlock]-openPrice[y])/openPrice[y]*100);
	}

	out.println(printUpGraph("Day Up separator: ", openClose, lineCount - dayBlock));
	out.println(printDownGraph("Day Down separator: ", openClose, lineCount - dayBlock));
%>	
<%!	
	public StringBuffer printUpGraph(String titleStr, double[] inputVar, int inputCount) {
		// Start -- Print continue up bar
		int d01 = 0;
		int d02 = 0;
		int d03 = 0;
		int d04 = 0;
		int d05 = 0;
		int d06 = 0;
		int d07 = 0;
		int d08 = 0;
		int d09 = 0;
		int d010 = 0;
		int totalD = 0;
		for (int l=0; l < inputCount; l++) {
			
			
			if (inputVar[l] < 1) {
				d01++;
			}
			if (inputVar[l] > 1 && inputVar[l] <= 2) {
				d02++;
			}
			if (inputVar[l] > 2 && inputVar[l] <= 3) {
				d03++;
			}
			if (inputVar[l] > 3 && inputVar[l] <= 4) {
				d04++;
			}
			if (inputVar[l] > 4 && inputVar[l] <= 5) {
				d05++;
			}
			if (inputVar[l] > 5 && inputVar[l] <= 6) {
				d06++;
			}
			if (inputVar[l] > 6 && inputVar[l] <= 7) {
				d07++;
			}
			if (inputVar[l] > 7 && inputVar[l] <= 8) {
				d08++;
			}
			if (inputVar[l] > 8 && inputVar[l] <= 9) {
				d09++;
			}
			if (inputVar[l] > 9 && inputVar[l] <= 30) {
				d010++;
			}
			
		}
		
		totalD = d01+d02+d03+d04+d05+d06+d07+d08+d09+d010;
		StringBuffer sb = new StringBuffer();
		sb.append("<br>"+titleStr+" <1: "+ d01 + " / " + totalD);
		sb.append("<br>"+titleStr+" <2: "+ d02 + " / " + totalD);
		sb.append("<br>"+titleStr+" <3: "+ d03 + " / " + totalD);
		sb.append("<br>"+titleStr+" <4: "+ d04 + " / " + totalD);
		sb.append("<br>"+titleStr+" <5: "+ d05 + " / " + totalD);
		sb.append("<br>"+titleStr+" <6: "+ d06 + " / " + totalD);
		sb.append("<br>"+titleStr+" <7: "+ d07 + " / " + totalD);
		sb.append("<br>"+titleStr+" <8: "+ d08 + " / " + totalD);
		sb.append("<br>"+titleStr+" <9: "+ d09 + " / " + totalD);
		sb.append("<br>"+titleStr+" ~: "+ d010 + " / " + totalD);
		return sb;
		// End -- Print continue up bar
	}
	
%>

<%!
	public StringBuffer printDownGraph(String titleStr, double[] inputVar, int inputCount) {
		// Start -- Print continue down bar
		int dd01 = 0;
		int dd02 = 0;
		int dd03 = 0;
		int dd04 = 0;
		int dd05 = 0;
		int dd06 = 0;
		int dd07 = 0;
		int dd08 = 0;
		int dd09 = 0;
		int dd010 = 0;
		int totalDD = 0;
		for (int l=0; l < inputCount; l++) {
			
			
			if (inputVar[l] < -1) {
				dd01++;
			}
			if (inputVar[l] < -2 && inputVar[l] >= -3) {
				dd02++;
			}
			if (inputVar[l] < -3 && inputVar[l] >= -4) {
				dd03++;
			}
			if (inputVar[l] < -4 && inputVar[l] >= -5) {
				dd04++;
			}
			if (inputVar[l] < -5 && inputVar[l] >= -6) {
				dd05++;
			}
			if (inputVar[l] < -6 && inputVar[l] >= -7) {
				dd06++;
			}
			if (inputVar[l] < -7 && inputVar[l] >= -8) {
				dd07++;
			}
			if (inputVar[l] < -8 && inputVar[l] >= -9) {
				dd08++;
			}
			if (inputVar[l] < -9 && inputVar[l] >= -10) {
				dd09++;
			}
			if (inputVar[l] < -10) {
				dd010++;
			}
			
		}
		
		totalDD = dd01+dd02+dd03+dd04+dd05+dd06+dd07+dd08+dd09+dd010;
		StringBuffer sb = new StringBuffer();
		sb.append("<br>");
		sb.append("<br>"+titleStr+" <-1: "+ dd01 + " / " + totalDD);
		sb.append("<br>"+titleStr+" <-2: "+ dd02 + " / " + totalDD);
		sb.append("<br>"+titleStr+" <-3: "+ dd03 + " / " + totalDD);
		sb.append("<br>"+titleStr+" <-4: "+ dd04 + " / " + totalDD);
		sb.append("<br>"+titleStr+" <-5: "+ dd05 + " / " + totalDD);
		sb.append("<br>"+titleStr+" <-6: "+ dd06 + " / " + totalDD);
		sb.append("<br>"+titleStr+" <-7: "+ dd07 + " / " + totalDD);
		sb.append("<br>"+titleStr+" <-8: "+ dd08 + " / " + totalDD);
		sb.append("<br>"+titleStr+" <-9: "+ dd09 + " / " + totalDD);
		sb.append("<br>"+titleStr+" ~: "+ dd010 + " / " + totalDD);
		return sb;
		// End -- Print continue down bar
			
	}

%>
</table>
</form>
</body>
</html>