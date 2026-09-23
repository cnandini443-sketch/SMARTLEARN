$baseUrl = "http://localhost:3000"

$courses = @(
    @{
        topic = 'Computer Science Engineering'
        courseName = 'Data Structures & Algorithms'
        videoTitle = 'Introduction to DSA'
        videoLink = 'https://www.youtube.com/embed/8hly31xKli0'
        pdfLink = 'https://www.cs.bham.ac.uk/~jxb/DSA/dsa.pdf'
    },
    @{
        topic = 'Computer Science Engineering'
        courseName = 'Operating Systems'
        videoTitle = 'OS Crash Course'
        videoLink = 'https://www.youtube.com/embed/26QPDBeUUgw'
        pdfLink = 'https://www.cs.uic.edu/~jbell/CourseNotes/OperatingSystems/Operating_Systems_Concepts.pdf'
    },
    @{
        topic = 'Computer Science Engineering'
        courseName = 'Database Management Systems'
        videoTitle = 'DBMS Full Course'
        videoLink = 'https://www.youtube.com/embed/kBdlM6hNDAE'
        pdfLink = 'https://www.cl.cam.ac.uk/teaching/1819/DataModels/databases.pdf'
    },
    @{
        topic = 'Computer Science Engineering'
        courseName = 'Computer Networks'
        videoTitle = 'Networking Basics'
        videoLink = 'https://www.youtube.com/embed/qiQR5rTSshw'
        pdfLink = 'http://www.cs.kent.edu/~farrell/cg08/lectures/networks.pdf'
    }
)

foreach ($c in $courses) {
    Invoke-RestMethod -Uri "$baseUrl/addCourse" -Method Post -Body $c
    Write-Host "Added $($c.courseName)"
}
